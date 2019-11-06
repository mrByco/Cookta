import {MongoHelper} from "../helpers/mongo.helper";
import { ObjectID } from "mongodb";
import {iIngredient} from "../interfaces/iingredient";
import {OwnFoodResponse} from "../interfaces/own.food.response";
import {IUpdateFoodRequest} from "../requests/create.food.request";
import {User} from "./user.model";

export class Food implements OwnFoodResponse {
    private static readonly CollectionName = "Foods";
    constructor(
        public owner: string,
        public name: string = "",
        public desc: string = "",
        public isPrivate: boolean = true,
        public published: boolean = false,
        public ingredients: iIngredient[] = [],
        public imageUploaded: number,
        public uploaded: number,
        public dose: number = 4,
        public tags: string[] = [],
        public lastModified: number,
        public generated: any = {},
        public subscriptions: number,
        public id: string = new ObjectID().toHexString(),
        public foodId: string
    ){
        let addId = async function (food: Food) {
            food.foodId = new ObjectID().toHexString();
            await food.Save();
            console.info("foodId Added for: " + food.id);
        };
        if (foodId === undefined){
            // noinspection JSIgnoredPromiseFromCall
            addId(this);
        }
    }

    public static async GetAllFoods(): Promise<Food[]> {
        let collection = await MongoHelper.getCollection(Food.CollectionName);
        let documents = await collection.find({}).toArray();
        let foods: Food[] = [];
        for (let doc of documents){
            foods.push(this.FromDocument(doc));
        }
        return foods;
    }
    public static async GetAllOwnFoods(user: User): Promise<Food[]> {
        let collection = await MongoHelper.getCollection(Food.CollectionName);
        let documents = await collection.find({owner: user.sub}).toArray();
        let foods: Food[] = [];
        for (let doc of documents){
            foods.push(this.FromDocument(doc));
        }
        return foods;
    }
    public static async GetFood(foodId: string): Promise<Food>{
        let foods = await this.GetAllFoods();
        return foods.find(f => f.foodId == foodId);
    }
    public static async UpdateFood(request: IUpdateFoodRequest, owner?: string): Promise<Food>{
        let existing: Food;
        if (request.foodId)
            existing = await this.GetFood(request.foodId);
        let collection = await MongoHelper.getCollection(Food.CollectionName);
        if (existing){
            existing.uploaded = Date.now();
            let doc = {...existing.ToDocument(), ...request};
            await collection.replaceOne({foodId: request.foodId}, doc);
            return await this.GetFood(request.foodId);
        }else{
            if (!owner)
                return null;
            if (!request.foodId)
                request.foodId = new ObjectID().toHexString();
            let food = new Food(
                owner,
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
    public static async Delete(id: string) {
        let food = await this.GetFood(id);
        if(!food){
            return null;
        }
        let collection = await MongoHelper.getCollection(Food.CollectionName);
        let deletedResult = await collection.deleteMany({foodId: food.foodId});
        if (deletedResult.deletedCount > 0){
            food.id = undefined;
            return food;
        }
        else
            return null;
    }
    public static async GetIncremental(start: number, count: number, filter: any = {}){
        let collection = await MongoHelper.getCollection(Food.CollectionName);
        let cursor = await collection.find(filter);
        cursor.skip(start);
        cursor.limit(count);
        let docs = await cursor.toArray();
        let foods: Food[] = [];
        for (let doc of docs){
            foods.push(Food.FromDocument(doc));
        }
        return foods;
    }
    private static FromDocument(doc: any): Food {
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
            doc['_id'],
            doc['foodId']
        )
    }
    private ToDocument(): any {
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
            _id: this.id,
            foodId: this.foodId
        }
    }
    public async Save(): Promise<void> {
        let document = this.ToDocument();
        let id = this.id;
        let collection = await MongoHelper.getCollection(Food.CollectionName);
        await collection.replaceOne({_id: id}, document);
        return;
    }
}
