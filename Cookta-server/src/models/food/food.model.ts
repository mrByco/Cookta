import {MongoHelper} from "../../helpers/mongo.helper";
import {ObjectID} from "mongodb";
import {iIngredient} from "../../interfaces/iingredient";
import {IUpdateFoodRequest} from "../../requests/create.food.request";
import {User} from "../user.model";
import {PersonalFood} from "./food-personal";
import {ForeignFood} from "./food-foreign";
import {Subscription} from "../subscription.model";
import {version} from "punycode";

export class Food {
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

    public static async GetFood(foodId: string, user: User): Promise<Food> {

        // let subscription = await Subscription.GetSubscription(user.sub, foodId);
        // let food;
        // if (subscription){
        //     food = await this.getFood(foodId, subscription.foodVersionId);
        // }else{
        //     food = await this.getFood(foodId);
        // }

        let food = await this.getFood(foodId);

        if (food == null) return null;


        if (user.sub == foodId || food.isPrivate == false) {
            return food;
        } else {
            return null;
        }
    }


    //TODO Not return normal response always null??
    private static async getFood(foodId: string, versionId?: string){
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let doc = versionId ?
            await collection.findOne({foodId: foodId}) :
            await collection.findOne({_id: new ObjectID(versionId)});
        return doc ? this.FromDocument(doc) : null;
    }


    public static async UpdateFood(request: IUpdateFoodRequest, modifier: User): Promise<Food> {
        let existing: Food;
        if (request.foodId)
            existing = await this.GetFood(request.foodId, modifier);
        let collection = await MongoHelper.getCollection(Food.CollectionName);
        if (existing){
            existing.uploaded = Date.now();
            let doc = {...existing.ToDocument(), ...request};
            await collection.replaceOne({foodId: request.foodId}, doc);
            return await this.GetFood(request.foodId, modifier);
        }else{
            if (modifier)
                return null;
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
        let food = await this.GetFood(id, deleter);
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

    public static async ToSendableAll(foods: Food[], sendFor: User) {
        let send = [];
        for (let food of foods) {
            if (sendFor.sub == food.owner) {
                send.push(await PersonalFood.Create(food));
            } else {
                send.push(await ForeignFood.Create(food));
            }
        }
        return send;
    }

    public async ToSendable(sendFor: User) {
        if (sendFor.sub == this.owner) {
            return await PersonalFood.Create(this);
        } else {
            return await ForeignFood.Create(this);
        }
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

    public static async GetFoodsOfTag(user: User, tagId: string): Promise<Food[]> {
        //TODO Placeholder (get all available foods)
        let foods = await this.GetAllOwnFoods(user);
        return foods.filter(value => value.tags.includes(tagId));
    }

}
