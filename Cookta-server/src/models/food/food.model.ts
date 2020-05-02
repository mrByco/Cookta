import {MongoHelper} from "../../helpers/mongo.helper";
import {ObjectID} from "mongodb";
import {User} from "../user.model";
import {SendableFood} from "./food-sendable";
import {Subscription} from "../subscription.model";
import {Services} from "../../Services";
import { IIngredient } from 'cookta-shared/src/models/ingredient/ingredient.interface';
import {IUpdateFoodRequest} from "cookta-shared/src/contracts/foods/update-food.request";

const {GetBlobService, createContainer, listContainers, uploadLocalJPEGImage, deleteBlob} = require('../../helpers/blobs');
const ContainerName = 'foodimages';


export class Food {
    public static readonly CollectionName = "Foods";
    private static readonly BlobContainerName = "foodimages";

    constructor(
        public owner: string,
        public name: string = "",
        public desc: string = "",
        public isPrivate: boolean = true,
        public published: boolean = false,
        public ingredients: IIngredient[] = [],
        public imageUploaded: number,
        public uploaded: number,
        public dose: number = 4,
        public tags: string[] = [],
        public lastModified: number,
        public generated: any = {},
        public subscriptions: number,
        public id: string = new ObjectID().toHexString(),
        public foodId: string
    ) {
        let addId = async function (food: Food) {
            food.foodId = new ObjectID().toHexString();
            await food.Save();
            console.info("foodId Added for: " + food.id);
        };
        if (foodId === undefined) {
            // noinspection JSIgnoredPromiseFromCall
            addId(this);
        }
    }

    public static async GetAllFoods(filter: any): Promise<Food[]> {
        let collection = await MongoHelper.getCollection(Food.CollectionName);
        let documents = await collection.find(filter).toArray();
        let foods: Food[] = [];
        for (let doc of documents) {
            foods.push(this.FromDocument(doc));
        }
        return foods;
    }

    public static async GetAllPublicFoods(): Promise<Food[]> {
        return await Food.GetAllFoods({published: true, private: false});
    }

    public static async GetAllOwnFoods(user: User): Promise<Food[]> {
        let collection = await MongoHelper.getCollection(Food.CollectionName);
        let documents = await collection.find({owner: user.sub}).toArray();
        let foods: Food[] = [];
        for (let doc of documents) {
            foods.push(this.FromDocument(doc));
        }
        return foods;
    }

    public static async GetFoodForUser(foodId: string, user: User): Promise<Food> {
        let food = await this.GetFood(foodId);

        if (food == null)
            return null;
        if (user == undefined && !food.isPrivate ||
            (Services.FamilyService.GetUserFamilies(user)).find(f => f.members.find(m => m.sub == food.owner))) {
            return food;
        }

        return food;
    }

    public static async GetFood(foodId?: string, versionId?: string) {
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let doc = versionId ?
            await collection.findOne({_id: new ObjectID(versionId)}) :
            await collection.findOne({foodId: foodId});
        return doc ? this.FromDocument(doc) : null;
    }

    public static async UpdateFood(request: IUpdateFoodRequest, modifier: User): Promise<Food> {
        let existing: Food;
        if (request.foodId)
            existing = await this.GetFoodForUser(request.foodId, modifier);
        let collection = await MongoHelper.getCollection(Food.CollectionName);
        if (existing) {
            existing.uploaded = Date.now();
            let doc = {...existing.ToDocument(), ...request};
            await collection.replaceOne({foodId: request.foodId}, doc);
            return await this.GetFoodForUser(request.foodId, modifier);
        } else {
            if (!request.foodId)
                request.foodId = new ObjectID().toHexString();
            let food = new Food(
                modifier.sub,
                request.name,
                request.desc,
                request.isPrivate,
                request.published,
                request.ingredients,
                undefined,
                Date.now(),
                request.dose,
                request.tags,
                Date.now(),
                {},
                undefined,
                undefined,
                new ObjectID().toHexString());
            await collection.insertOne(food.ToDocument());
            return food;
        }
    }

    public static async Delete(id: string, deleter: User) {
        let food = await this.GetFoodForUser(id, deleter);
        if (!food) {
            return null;
        }
        let collection = await MongoHelper.getCollection(Food.CollectionName);
        let deletedResult = await collection.deleteMany({foodId: food.foodId});
        if (deletedResult.deletedCount > 0) {
            food.id = undefined;
            return food;
        } else
            return null;
    }

    public static async GetIncremental(start: number, count: number, filter: any = {}) {
        let collection = await MongoHelper.getCollection(Food.CollectionName);
        let cursor = await collection.find(filter);
        cursor.skip(start);
        cursor.limit(count);
        let docs = await cursor.toArray();
        let foods: Food[] = [];
        for (let doc of docs) {
            foods.push(Food.FromDocument(doc));
        }
        return foods;
    }

    public static async ToSendableAll(foods: Food[], sendFor?: User) {
        let send = [];
        let subFoods = sendFor ? await Subscription.GetSubsFoodsOfUser(sendFor) : undefined;
        for (let food of foods) {
            send.push(await food.ToSendable(sendFor, subFoods));
        }
        return send;
    }

    public async ToSendable(sendFor?: User, cachedSubFoods?: Food[]) {
        return await SendableFood.Create(this, sendFor, cachedSubFoods);
    }

    public static async UploadImage(foodVersionName: string, path: string, user: User) {
        let food = await Food.GetFood(undefined, foodVersionName);
        if (food == null)
            throw new Error("Food not found");
        if (food.owner != user.sub)
            throw new Error("No permission to modify the food.");

        let response = await listContainers();
        console.log('Uploading image');
        response = await uploadLocalJPEGImage(Food.BlobContainerName, path, foodVersionName);
        console.log(response.message);
        let collection = await MongoHelper.getCollection(this.CollectionName);

        food.imageUploaded = Date.now();
        await food.Save();

        return food;
    }

    public static async DeleteImage(foodVersionId: string, user: User): Promise<boolean> {
        let food = await Food.GetFood(undefined, foodVersionId);
        if (food == null) {
            throw Error('Food not found!');
        }
        if (food.owner != user.sub) {
            return false;
        }
        food.imageUploaded = null;
        await food.Save();
        return true;
    }


    public static FromDocument(doc: any): Food {
        return new Food(
            doc['owner'],
            doc['name'],
            doc['desc'],
            doc['private'],
            doc['published'],
            doc['ingredients'],
            doc['imageUploaded'],
            doc['uploaded'],
            doc['dose'],
            doc['tags'],
            doc['lastModified'],
            doc['generated'],
            doc['subscriptions'],
            typeof (doc['_id']) != 'string' ? (doc['_id'] as ObjectID).toHexString() : doc['_id'], //need to handle either ObjectID and string
            doc['foodId']
        )
    }

    public ToDocument(): any {
        return {
            owner: this.owner,
            name: this.name,
            desc: this.desc,
            private: this.isPrivate,
            published: this.published,
            ingredients: this.ingredients,
            imageUploaded: this.imageUploaded,
            uploaded: this.uploaded,
            dose: this.dose,
            tags: this.tags,
            lastModified: this.lastModified,
            generated: this.generated,
            subscriptions: this.subscriptions,
            _id: new ObjectID(this.id),
            foodId: this.foodId
        }
    }

    public async Save(): Promise<void> {
        let document = this.ToDocument();
        let id = this.id;
        let collection = await MongoHelper.getCollection(Food.CollectionName);
        await collection.replaceOne({_id: new ObjectID(id)}, document);
        return;
    }

    public static async GetFoodsOfTag(user: User, tagId: string): Promise<Food[]> {
        let foods = await this.GetCollectionForUser(user);
        return foods.filter(value => value.tags.includes(tagId));
    }

    public static async GetCollectionForUser(user: User): Promise<Food[]>{
        let foods = await Subscription.GetSubsFoodsOfUser(user);
        foods = foods.concat(await Food.GetAllOwnFoods(user));
        return foods.concat(await user.GetCurrentFamily().GetFamilyFoods());
    }

}
