import {Food} from "./food/food.model";
import {User} from "./user.model";
import {ObjectID} from "bson";
import {MongoHelper} from "../helpers/mongo.helper";

export class Subscription {

    public static readonly CollectionName = 'Subcription';




    constructor (
        public userSub: string,
        public foodVersionId: string,
        public foodId: string,
        public _id: string
    ) {}


    public static async GetSubsFoodsOfUser(user: User): Promise<Food[]> {
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let subDocs = await collection.find({sub: user.sub}).toArray();
        let subs: Subscription[] = [];
        for (let doc of subDocs){
            subs.push(await this.FromDocument(doc));
        }
        let foods: Food[] = [];
        for (let sub of subs){
            foods.push(await Food.GetFood(sub.foodId, sub.foodVersionId));
        }
        return foods;
    }

    public static async GetSubscription(userSub: string, foodId: string){
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let subDoc = await collection.findOne({sub: userSub, foodId: foodId});
        return subDoc ? await this.FromDocument(subDoc) : null;
    }

    public static async SetUserSubState(user: User, foodId: string, state: boolean): Promise<Subscription>{
        let collection = await MongoHelper.getCollection(this.CollectionName);
        if (!state){
            await collection.deleteMany({sub: user.sub, foodID: foodId});
            return null;
        }
        if (state){
            //if already has subscription
            let doc = await collection.findOne({sub: user.sub, foodID: foodId});
            if (!doc){
                let food = await Food.GetFoodForUser(foodId, user);
                let newSubscription = new Subscription(user.sub, food.foodId, food.id, new ObjectID().toHexString());
                await collection.insertOne(newSubscription.ToDocument());
                return newSubscription;
            }
        }
    }

    public static async FromDocument(doc: any): Promise<Subscription>{
        let sub =  new Subscription(
            doc['sub'],
            doc['foodID'], //used by legacy server (food version)
            doc[''] ? doc['foodTypeId'] : null, //food type id
            doc['_id']
        )
        try{
            if (sub.foodId == null){
                sub.foodId = (await Food.GetFood(null, sub.foodVersionId)).foodId;
            }
        }
        catch{
            return null;
        }
        return sub;
    }
    public ToDocument(): any{
        return {
            sub: this.userSub,
            foodID: this.foodVersionId, //used by legacy server (food version id)
            foodTypeId: this.foodId, //food type id
            _id: new ObjectID(this._id)
        }
    }
}
