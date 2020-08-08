import {Food} from '../../models/food/food.model';
import {StoreService} from 'atomik/lib/store-service/store-service';
import {IFoodService} from './food.service.interface';
import {IUpdateFoodRequest} from 'cookta-shared/src/contracts/foods/update-food.request';
import {Services} from '../../Services';
import {Collection, Cursor, ObjectID} from 'mongodb';
import {MongoHelper} from '../../helpers/mongo.helper';
import {Subscription} from '../../models/subscription.model';
import {Family} from '../../models/family.model';
import {uploadLocalJPEGImage} from '../../helpers/blobs';
import {Tag} from '../../models/tag.model';
import {User} from '../../models/user.model';
import {SitemapService} from '../sitemap-service';

const BlobContainerName = 'foodimages';

export class FoodService extends StoreService<Food> implements IFoodService {


    constructor(private collectionName: string) {
        super(id => new Food(id), collectionName);
    }

    GetAllFoods(filter: any): Food[] {
        return this.GetAllItems().filter(item => {
            for (let key of Object.keys(filter)) {
                if (item[key] != filter[key]) return false;
            }
            return true;
        });
    }

    GetAllPublicFoods(): Food[] {
        return this.GetAllFoods({published: true, private: false});
    }

    GetAllOwnFoods(userSub: string) {
        return this.GetAllFoods({owner: userSub});
    }

    GetFoodForUser(foodId: string, userSub?: string): Food {
        let food = this.Items.find(f => f.foodId == foodId);
        if (food == null) return null;
        if (userSub && userSub == food.owner) return food;
        if (!food.private) return food;
        let relatives = Services.FamilyService.GetUserRelatedFamilies(userSub)
        if (relatives.find(f => f.members.find(m => m.sub == food.owner))) return food;
        return null;
    }

    //Find the food, dont check permissions.
    GetFood(foodId?: string, versionId?: string): Food {
        if (versionId) {
            let item = this.FindOne(i => i.id == versionId);
            if (item) return item;
        }
        if (foodId) {
            let item = this.FindOne((i => i.foodId == foodId));
            if (item) return item;
        }
        return null;
    }

    UpdateFood(request: IUpdateFoodRequest, changerSub: string) {
        let food: Food = request.foodId? this.GetFoodForUser(request.foodId, changerSub) : undefined;
        if (!food) {
            if (!request.foodId) request.foodId = new ObjectID().toHexString();
            food = this.CreateItem(new ObjectID());
            food.ingredients = [];
            food.tags = [];
            food.generated = {tags: []};
            food.owner = changerSub;
            food.dose = 4;
            [food.desc, food.name] = ['', ''];
            food.private = true;
            food.published = false;
            food.lastModified = Date.now();
            food.uploaded = Date.now();
        }
        if (food.published && request.private) Subscription.RemoveFoodReferences(food.foodId);
        food.lastModified = Date.now();
        Object.keys(request).forEach(k => food[k] = request[k]);
        food.published = !food.private;
        this.SaveFood(food);
        SitemapService.Instance.RerenderPage(`/foods/${food.foodId}`);
        return this.GetFoodForUser(food.foodId, changerSub);
    }

    Delete(id: string, deleterSub: string) {
        let food = this.GetFoodForUser(id, deleterSub);
        if (food.owner != deleterSub) throw new Error('Deleter is not owner of food');
        if (!food) return null;
        Subscription.RemoveFoodReferences(food.foodId);
        this.RemoveItem(food);
    }

    async SaveFood(food: Food, generate: boolean = true) {
        if (generate) food.generated = await this.GetGenerateDataForFood(food);
        await this.SaveItem(food);
    }

    async FoodSearch(text: string, count: number): Promise<Food[]> {
        let collection = await MongoHelper.getCollection(this.collectionName);
        let aggregationResult = await collection.aggregate([
            {
                $searchBeta: {
                    index: 'test',
                    search: {
                        path: ['name', 'desc'],
                        query: text,
                        score: {boost: {"value": 1}}
                    },
                }
            },
            {$match: {published: true}},
            {$limit: count}
        ]);
        let documents = await aggregationResult.toArray();
        return documents.map(d => this.FromSaveJson(d));
    }


    async GetCollectionForUser(userSub: string, currentFamily: Family): Promise<Food[]> {
        let subFoods = await Subscription.GetSubsFoodsOfUser(userSub);
        let ownFoods = this.GetAllOwnFoods(userSub);
        let familyFoods = await currentFamily.GetFamilyFoods();
        let foods: Food[] = [];
        foods.push(...subFoods);
        foods.push(...ownFoods.filter(ownFood => !foods.find(f => f.id == ownFood.id)));
        foods.push(...familyFoods.filter(familyFood => !foods.find(f => f.id == familyFood.id)));
        return foods;
    }


    FilterByTags(foods: Food[], tagId: string): Food[] {
        return foods.filter(value => {
                let generatedContains = value.generated?.tags ? value.generated.tags.find(t => t.guid == tagId) != null : false;
                return value.tags.includes(tagId) || generatedContains;
            });
    }

    GetIncremental(start: number, count: number, filter?: any): Promise<Food[]> {
        throw new Error('Not imeplemented function');
    }


    async UploadImage(foodVersionName: string, path: string, userSub: string) {
        let food = await this.GetFood(undefined, foodVersionName);
        if (food == null) throw new Error("Food not found");
        if (food.owner != userSub) throw new Error("No permission to modify the food.");

        await uploadLocalJPEGImage(BlobContainerName, path, foodVersionName);

        food.imageUploaded = Date.now();
        await this.SaveItem(food);
        return food;
    }

    async DeleteImage(foodVersionId: string, userSub: string): Promise<boolean> {
        let food = await this.GetFood(undefined, foodVersionId);
        if (food == null) {
            throw Error('Food not found!');
        }
        if (food.owner != userSub) {
            return false;
        }
        food.imageUploaded = null;
        await this.SaveItem(food);
        return true;
    }

    public async MakeRequest(req: any, getDocuments: (cursor: Cursor) => Promise<any[]>): Promise<Food[]> {
        let collection = this['Collection'] as Collection;
        let cursor = await collection.find(req);
        let docuements = await getDocuments(cursor);
        let foods: Food[] = docuements.map(d => this.FromSaveJson(d));
        return foods;
    }

    private async GetGenerateDataForFood(food: Food): Promise<{ tags: Tag[] }> {
        let tags: Tag[] = [];
        let tagsToCheck: Tag[] = await Promise.all(food.tags.map(async (t) => await Tag.GetTagById(t)));
        while (tagsToCheck.length > 0) {
            let current = tagsToCheck[0];

            //Includes means its parents already added
            if (!tags.includes(current)) {
                if (!food.tags.includes(current.guid))
                    tags.push(current);
                let parent: Tag = current.parentId ? await Tag.GetTagById(current.parentId) : undefined;
                if (parent) tagsToCheck.push(parent);
            }
            tagsToCheck.shift();
        }
        return {tags: tags};
    }

    async GetFoodRecommendations(food: Food, count: number, user?: User): Promise<Food[]> {
        let publicFoods: Food[] = this.Items.filter(f => !f.private);
        let recommendations: Food[] = [];

        let ignoreFirstRound = user ? (await this.GetCollectionForUser(user.sub, user.GetCurrentFamily())).map(f => f.id) : [];

        //ignore self
        ignoreFirstRound.push(food.id);

        for (let matchTags = food.tags.length;
             matchTags > 0 && recommendations.length < count;
             matchTags--) {
            let found = publicFoods
                .filter(i => !ignoreFirstRound.includes(i.id) && this.countMatchTags(food, i) == matchTags);

            recommendations.push(...recommendations.length + found.length > count
                ? found.slice(0, count - recommendations.length)
                : found);
        }

        if (user && recommendations.length < count){
            for (let matchTags = food.tags.length;
                 matchTags > 0 && recommendations.length < count;
                 matchTags--) {
                let found = publicFoods
                    .filter(i => this.countMatchTags(food, i) == matchTags && food.id != i.id);

                recommendations.push(...found.length + recommendations.length > count
                    ? found.slice(0, count - recommendations.length)
                    : found);
            }
        }

        return recommendations;
    }

    countMatchTags(food1: Food, food2: Food): number {
        let match = 0;
        food1.generated?.tags?.forEach(t => {
            food2.generated?.tags?.forEach(t2 => match += t.guid == t2.guid ? 1 : 0);
        });
        return match;
    }


    protected FromSaveJson(doc: any): Food {
        let food = super.FromSaveJson(doc);
        if (!food.foodId) food.foodId = food.id;
        return food;
    }


}
