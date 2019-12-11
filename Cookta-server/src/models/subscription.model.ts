import {Food} from "./food/food.model";
import {User} from "./user.model";
import {ObjectID} from "bson";
import {MongoHelper} from "../helpers/mongo.helper";

export class Subscription {

    private static readonly CollectionName = 'Subcription';




    constructor (
        public userSub: string,
        public foodId: string,
        public foodVersionId: string,
    ) {}


    public static async GetSubsFoodsOfUser(user: User): Promise<Food[]> {
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let subDocs = await collection.find({sub: user.sub}).toArray();
        let subFoods: Food[] = [];
        for (let doc of subDocs){
            subFoods.push(await Food.GetFood(doc['foodID'], user));
        }
        return subFoods;
    }

    public static async GetSubscription(userSub: string, foodId: string){
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let subDoc = await collection.findOne({sub: userSub, foodId: foodId});
        return subDoc ? this.FromDocument(subDoc) : null;
    }

    public static async SetUserSubState(user: User, foodId: string, state: boolean): Promise<Subscription>{
        let collection = await MongoHelper.getCollection(this.CollectionName);
        if (!state){
            await collection.deleteMany({sub: user._id, foodId: foodId});
            return null;
        }
        if (state){
            //if already has subscription
            let doc = await collection.findOne({sub: user, foodId: foodId});
            if (!doc){
                let food = await Food.GetFood(foodId, user);
                let newSubscription = new Subscription(user._id, food.foodId, food.id);
                await collection.insertOne(newSubscription.ToDocument());
                return newSubscription;
            }
        }
    }

    public static FromDocument(doc: any): Subscription{
        return new Subscription(
            doc['sub'],
            doc['foodID'],
            doc['foodVersionId'] ? doc['foodVersionId'] : doc['foodId']
        )
    }
    public ToDocument(): any{
        return {
            sub: this.userSub,
            foodID: this.foodId,
            foodVersionId: this.foodVersionId,
        }
    }
}
