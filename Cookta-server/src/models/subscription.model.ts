import {Food} from './food/food.model';
import {User} from './user.model';
import {ObjectID} from 'bson';
import {MongoHelper} from '../helpers/mongo.helper';
import {Services} from '../Services';

export class Subscription {

    public static readonly CollectionName = 'Subcription';


    constructor(
        public userSub: string,
        public foodVersionId: string,
        public foodId: string,
        public _id: string
    ) {}


    public static async GetSubsFoodsOfUser(userSub: string): Promise<Food[]> {
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let subDocs = await collection.find({sub: userSub}).toArray();
        let subs: Subscription[] = [];
        for (let doc of subDocs){
            let subscription = await this.FromDocument(doc);
            if (subscription == null){
                console.error("Subscription parsed but null.");
                continue;
            }
            subs.push(subscription);
        }
        let foods: Food[] = [];
        for (let sub of subs){
            foods.push(Services.FoodService.GetFood(sub.foodId, sub.foodVersionId));
        }
        return foods;
    }

    public static async GetSubscription(userSub: string, foodVersionId: string){
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let subDoc = await collection.findOne({sub: userSub, foodID: foodVersionId});
        return subDoc ? await this.FromDocument(subDoc) : null;
    }

    public static async SetUserSubState(user: User, foodId: string, state: boolean): Promise<Subscription>{
        let collection = await MongoHelper.getCollection(this.CollectionName);
        if (!state){
            let deletedResult = await collection.deleteMany({sub: user.sub, foodTypeId: foodId});
            console.log(deletedResult);
            return null;
        }
        if (state){
            //if already has subscription
            let doc = await collection.findOne({sub: user.sub, foodID: foodId});
            if (!doc){
                let food = await Services.FoodService.GetFoodForUser(foodId, user.sub);
                let newSubscription = new Subscription(user.sub, food.id, food.foodId, new ObjectID().toHexString());
                await collection.insertOne(newSubscription.ToDocument());
                return newSubscription;
            }
        }
    }

    public static async RemoveFoodReferences(foodId: string){
        let collection = await MongoHelper.getCollection(this.CollectionName);
        await collection.deleteMany({foodTypeId: foodId});
    }

    public static async FromDocument(doc: any): Promise<Subscription>{
        let sub =  new Subscription(
            doc['sub'],
            doc['foodID'], //bad naming legacy db (its food version)
            doc[''] ? doc['foodTypeId'] : null, //food type id
            doc['_id']
        );
        let refFood = sub.getReferencingFood();
        if (!refFood) return null;
        if (sub.foodVersionId != refFood.id || sub.foodId != refFood.foodId)
            [sub.foodVersionId, sub.foodId] = [refFood.id, refFood.foodId];
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

    public static async GetAll(): Promise<Subscription[]> {
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let subDocs = await collection.find({}).toArray();
        let subs: Subscription[] = [];
        for (let doc of subDocs){
            let subscription = await this.FromDocument(doc);
            if (subscription == null){
                continue;
            }
            subs.push(subscription);
        }
        return subs;
    }

    async Save(): Promise<void> {
        let collection = await MongoHelper.getCollection(Subscription.CollectionName);
        await collection.replaceOne({_id: new ObjectID(this._id)}, this.ToDocument(), {upsert: true});
    }

    getReferencingFood() {
        return Services.FoodService.GetFood(this.foodId, this.foodVersionId);
    }

    static async GetFoodSubscriptions(foodId: string): Promise<number> {
        let collection = await MongoHelper.getCollection(Subscription.CollectionName);
        return collection.find({foodTypeId: foodId}).toArray().then(a => a.length);
    }

}
