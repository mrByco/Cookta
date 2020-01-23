import {User} from "../user.model";
import {MongoHelper} from "../../helpers/mongo.helper";
import {Food} from "../food/food.model";
import {IMealing} from "./IMealing.interface";


export class Day {
    private static readonly CollectionName = 'Days';

    constructor(public date: string,
                public mealings: IMealing[],
                public familyId: string) {
    }

    public static async GetDay(date: string, user: User) {
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let document = await collection.findOne({date: date, familyId: user.currentFamilyId});
        if (!document) return new Day(date,  [], user.currentFamilyId);
        return this.FromDocument(document);
    }

    private static FromDocument(document): Day {
        return new Day(
            document['date'],
            document['mealings'],
            document['familyId']);
    }

    public async SetDay(mealings: IMealing[]) {
        let collection = await MongoHelper.getCollection(Day.CollectionName);
        let day = new Day(this.date, mealings, this.familyId);
        await collection.replaceOne({date: this.date, familyId: this.familyId}, day.ToDocument(), {upsert: true});
        return day;
    }

    public async RefreshTagMealing(index: number, user: User) {
        let mealing = await this.mealings[index];
        if (!mealing) return null;
        if (this.mealings[index].type == "tag") {
            let foods = await Food.GetFoodsOfTag(user, mealing.id);
            let food = await foods[Math.round(Math.random() * foods.length - 1)];
            mealing.foodId = food.id;
        }
        let collection = await MongoHelper.getCollection(Day.CollectionName);
        await collection.replaceOne({date: this.date, familyId: this.familyId}, this.ToDocument(), {upsert: true});
    }

    private ToDocument(): any {
        return {
            date: this.date,
            mealings: this.mealings,
            familyId: this.familyId,
        }
    }

}
