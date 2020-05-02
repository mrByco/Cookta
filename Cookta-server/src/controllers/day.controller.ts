
import {Day} from "../models/Days/day.model";
import {ObjectID} from "mongodb";
import {Food} from "../models/food/food.model";
import {User} from "../models/user.model";
import {Controller} from "waxen/dist/deorators/controller";
import {Contracts} from "cookta-shared/src/contracts/contracts";
import {Security} from "waxen/dist/deorators/security";
import {IMealing} from 'cookta-shared/src/models/days/mealing.interface';
import {IDay} from "cookta-shared/src/models/days/day.interface";


@Controller(Contracts.Days)
export class DayController {
    @Security(false)
    public async GetDay(reqBody: void, user: User, date: string): Promise<IDay> {
        return await Day.GetDay(date, user.GetCurrentFamily());
    }

    @Security(false)
    public async SetDay(reqBody: IMealing[], user: User, date: string): Promise<IDay> {
        for (let mealing of reqBody) {
            if (!mealing.id) {
                mealing.id = new ObjectID().toHexString();
            }
            if (!mealing.foodId) {
                let foods = await Food.GetFoodsOfTag(user, mealing.info.tagId);
                let food = foods[Math.floor(Math.random() * foods.length)];
                mealing.foodId = food ? food.foodId : undefined;
            }
        }
        let day = await Day.GetDay(date, user.GetCurrentFamily());
        await day.SetDay(reqBody);
        return day;
    }

    @Security(false)
    public async RefreshMeal(reqBody: void, user: User, date: string, mealingIndex: number): Promise<IDay> {
        let day = await Day.GetDay(date, user.GetCurrentFamily());
        await day.RefreshTagMealing(+mealingIndex, user);
        return day
    }

    @Security(false)
    public async FinalizeMealing(reqBody: void, user: User, date: string, mealingIdentity: number): Promise<IDay> {

        let day = await Day.GetDay(date, user.GetCurrentFamily());
        await day.FinalizeMealing(+mealingIdentity, user);
        return day;
    }

}
