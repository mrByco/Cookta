import {User} from "./user.model";
import {MongoHelper} from "../helpers/mongo.helper";
import {Food} from "./food/food.model";

interface IMealing {
    type: string,
    mealIndex: number,
    id: string,
    foodId: string,
}

export class Day {
    private static readonly CollectionName = 'Days';

    constructor(public date: string,
                public sub: string,
                public mealings: IMealing[]) {
    }

    public static async GetDay(date: string, user: User) {
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let document = await collection.findOne({date: date, sub: user.sub});
        if (!document) return new Day(date, user.sub, []);
        return this.FromDocument(document);
    }

    private static FromDocument(document): Day {
        return new Day(
            document['date'],
            document['sub'],
            document['mealings']);
    }

    public async SetDay(mealings: IMealing[]) {
        let collection = await MongoHelper.getCollection(Day.CollectionName);
        let day = new Day(this.date, this.sub, mealings);
        await collection.replaceOne({date: this.date, sub: this.sub}, day.ToDocument(), {upsert: true});
        return day;
    }

    public async RefreshTagMealing(index: number) {
        let user = await User.GetUser(this.sub);
        let mealing = await this.mealings[index];
        if (!mealing) return null;
        if (this.mealings[index].type == "tag") {
            let foods = await Food.GetFoodsOfTag(user, mealing.id);
            let food = await foods[Math.round(Math.random() * foods.length - 1)];
            mealing.foodId = food.id;
        }
        let collection = await MongoHelper.getCollection(Day.CollectionName);
        await collection.replaceOne({date: this.date, sub: this.sub}, this.ToDocument(), {upsert: true});
    }

    private ToDocument(): any {
        return {
            date: this.date,
            sub: this.sub,
            mealings: this.mealings,
        }
    }

}
