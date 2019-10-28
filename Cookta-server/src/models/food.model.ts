import {MongoHelper} from "../helpers/mongo.helper";
import { ObjectID } from "mongodb";
import {iIngredient} from "../interfaces/iingredient";

export class Food {
    private static readonly CollectionName = "Foods";
    constructor(
        public owner: string,
        public name: string,
        public desc: string,
        public isPrivate: boolean,
        public published: boolean,
        public ingredients: iIngredient[],
        public imageUploaded: number,
        public uploaded: number,
        public dose: number,
        public tags: string[],
        public lastModified: number,
        public generated: any,
        public subscriptions: number,
        public id: string = new ObjectID().toHexString(),
        public foodId: string = new ObjectID().toHexString()
    ){}

    public static async GetAllFoods(): Promise<Food[]> {
        let collection = await MongoHelper.getCollection(Food.CollectionName);
        let documents = await collection.find({}).toArray();
        let foods: Food[] = [];
        for (let doc of documents){
            foods.push(this.FromDocument(doc));
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
    private static ToDocument(food: Food): any {
        return {
            owner: food.owner,
            name: food.name,
            desc: food.desc,
            private: food.isPrivate,
            published: food.published,
            ingredients: food.ingredients,
            imageUploaded: food.imageUploaded,
            uploaded: food.uploaded,
            dose: food.dose,
            tags: food.tags,
            lastModified: food.lastModified,
            generated: food.generated,
            subscriptions: food.subscriptions,
            foodId: food.foodId
        }
    }

    public async Save(): Promise<void> {
        let document = Food.ToDocument(this);
        let id = this.id;
        let collection = await MongoHelper.getCollection(Food.CollectionName);
        await collection.replaceOne({_id: id}, document);
        return;
    }
}
