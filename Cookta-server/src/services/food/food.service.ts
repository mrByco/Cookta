import {Food} from "../../models/food/food.model";
import {StoreService} from "atomik/lib/store-service/store-service";
import {IFoodService} from "./food.service.interface";
import {IUpdateFoodRequest} from 'cookta-shared/src/contracts/foods/update-food.request';
import {Services} from "../../Services";
import {ObjectID} from "mongodb";
import {MongoHelper} from "../../helpers/mongo.helper";
import {Subscription} from "../../models/subscription.model";
import {Family} from "../../models/family.model";
import {uploadLocalJPEGImage} from "../../helpers/blobs";
import {Tag} from '../../models/tag.model';
import {TagService} from "../../../../Cookta-online/src/app/shared/services/tag.service";

const BlobContainerName = "foodimages";

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

    GetFoodForUser(foodId: string, userSub: string): Food {
        let food = this.Items.find(f => f.foodId == foodId);
        if (food == null) return null;
        if (userSub == food.owner) return food;
        if (!food.isPrivate) return food;
        let relatives = Services.FamilyService.GetUserFamilies(userSub)
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
        let food: Food;
        if (request.foodId) food = this.GetFoodForUser(request.foodId, changerSub);

        if (food) {
            food.uploaded = Date.now();
            Object.keys(k => this[k] = request[k]);
            this.SaveFood(food);
            return this.GetFoodForUser(food.foodId, changerSub);
        }
        if (!request.foodId) request.foodId = new ObjectID().toHexString();
        food = this.CreateItem(new ObjectID());
        food.ingredients = [];
        food.tags = [];
        food.owner = changerSub;
        food.uploaded = Date.now();
        food.lastModified = Date.now();
        this.SaveFood(food);
        return food;
    }

    Delete(id: string, deleterSub: string) {
        let food = this.GetFoodForUser(id, deleterSub);
        if (food.owner != deleterSub) throw new Error('Deleter is not owner of food');
        if (!food) return null;
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
        let foods = await Subscription.GetSubsFoodsOfUser(userSub);
        foods = foods.concat(this.GetAllOwnFoods(userSub));
        return foods.concat(await currentFamily.GetFamilyFoods());
    }


    FilterByTags = (foods: Food[], tagId: string): Food[] => foods.filter(value => value.tags.includes(tagId));

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

    private async GetGenerateDataForFood(food: Food): Promise<{ tags: Tag[] }> {
        let tags = [];
        let tagsToCheck: Tag[] = await Promise.all(food.tags.map(async (t) => await Tag.GetTagById(t)));
        while (tagsToCheck.length > 0) {
            let current = tagsToCheck[0];

            //Includes means its parents already added
            if (tags.includes(current)) continue;

            if (!food.tags.includes(current.guid)) tags.push(current.guid);
            let parent: Tag = current.parentId ? await Tag.GetTagById(current.parentId) : undefined;
            if (parent) tagsToCheck.push(parent);
        }
        return {tags: tags};
    }


}
