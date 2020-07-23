import {User} from '../user.model';
import {MongoHelper} from '../../helpers/mongo.helper';
import {Food} from '../food/food.model';
import {IMealing} from 'cookta-shared/src/models/days/mealing.interface';
import {Services} from '../../Services';


export class Day {
    private static readonly CollectionName = 'Days';

    constructor(public date: string,
                public mealings: IMealing[],
                public familyId: string) {
        mealings.forEach(m => {
            if (!m.dose) m.dose = 4
        })
    }

    public static async GetDay(date: string, familyId: string) {
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let document = await collection.findOne({date: date, familyId: familyId});
        if (!document) return new Day(date, [], familyId);
        return this.FromDocument(document);
    }

    private static FromDocument(document): Day {
        return new Day(
            document['date'],
            document['mealings'],
            document['familyId']);
    }

    private async Save(): Promise<void> {
        let collection = await MongoHelper.getCollection(Day.CollectionName);
        await collection.replaceOne({date: this.date, familyId: this.familyId}, this.ToDocument(), {upsert: true});
    }

    public async SetDay(mealings: IMealing[]) {
        let collection = await MongoHelper.getCollection(Day.CollectionName);
        this.mealings = mealings;
        await collection.replaceOne({date: this.date, familyId: this.familyId}, this.ToDocument(), {upsert: true});
        return this;
    }

    public async RefreshTagMealing(index: number, user: User) {
        let mealing = await this.mealings[index];
        if (!mealing) return null;
        if (this.mealings[index].type == "tag") {
            let foodCollection = await Services.FoodService.GetCollectionForUser(user.sub, user.GetCurrentFamily());
            let foods = Services.FoodService.FilterByTags(foodCollection, mealing.info.tagId);
            let food = await foods[Math.floor(Math.random() * foods.length)];
            mealing.foodId = food ? food.foodId : undefined;
        }
        await this.Save();
    }

    public async FinalizeMealing(index: number, user: User): Promise<IMealing> {
        let mealing = await this.mealings[index];
        if (!mealing) return null;
        let food: Food = await Services.FoodService.GetFoodForUser(mealing.foodId, user.sub);
        if (!food) {
            return null;
        }
        mealing.type = 'final';
        mealing.info.finalFood = await food.ToSendable(user);
        await this.Save();
        return mealing;
    }

    private ToDocument(): any {
        return {
            date: this.date,
            mealings: this.mealings,
            familyId: this.familyId,
        }
    }
}
