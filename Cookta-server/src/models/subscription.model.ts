import {Food} from "./food/food.model";
import {User} from "./user.model";
import {ObjectID} from "bson";
import {MongoHelper} from "../helpers/mongo.helper";

export class Subscription {

    private static readonly CollectionName = 'Subcription';




    constructor (
        public userId: string,
        public foodId: string,
        public foodVersionId: string,
    ) {}


    public static async GetSubsFoodsOfUser(user: User): Promise<Food[]> {
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let subDocs = await collection.find({userId: user._id}).toArray();
        let subFoods: Food[] = [];
        for (let doc of subDocs){
            subFoods.push(await Food.GetFood(doc['foodId'], user));
        }
        return subFoods;
    }

    public static async GetSubscription(userId: string, foodId: string){
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let subDoc = await collection.findOne({sub: userId, foodId: foodId});
        return subDoc ? this.FromDocument(subDoc) : null;
    }

    public static SetUserSubState(user: User, foodId: string, state: boolean) {

    }

    public static FromDocument(doc: any): Subscription{
        return new Subscription(
            doc['sub'],
            doc['foodId'],
            doc['foodVersionId'] ? doc['foodVersionId'] : doc['foodId']
        )
    }
    public ToDocument(): any{
        return {
            sub: this.userId,
            foodId: this.foodId,
            foodVersionId: this.foodVersionId,
        }
    }
}
