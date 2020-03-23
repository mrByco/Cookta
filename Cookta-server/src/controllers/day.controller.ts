import {Body, Controller, Get, Put, Request, Route, Security, Tags} from "tsoa";
import {Day} from "../models/Days/day.model";
import {IMealing} from "../models/Days/IMealing.interface";
import { ObjectID } from "mongodb";
import {Food} from "../models/food/food.model";
import {User} from "../models/user.model";

@Route("/day")
@Tags("Days")
export class DayController extends Controller {
    @Security('Bearer', [])
    @Get('/{date}')
    public async GetDay(@Request() request, date: string): Promise<Day> {
        try {
            let user = request.user as User;
            return await Day.GetDay(date, user);
        } catch {
            this.setStatus(500);
            return;
        }
    }

    @Security('Bearer', [])
    @Put('/{date}')
    public async SetDay(@Request() request, date: string, @Body() mealings: IMealing[]): Promise<Day> {
        //try {
            let user = request.user as User;
            for (let mealing of mealings){
                if (!mealing.id){
                    mealing.id = new ObjectID().toHexString();
                }
                if (!mealing.foodId){
                    let foods = await Food.GetFoodsOfTag(user, mealing.info.tagId);
                    let food = foods[Math.floor(Math.random() * foods.length)];
                    mealing.foodId = food ? food.foodId : undefined;
                }
            }
            let day = await Day.GetDay(date, user);
            await day.SetDay(mealings);
            return day;
    }

    @Security('Bearer', [])
    @Get('/{date}/{mealingIdentity}')
    public async RefreshDay(@Request() request, date: string, mealingIdentity: number): Promise<Day> {
        try {
            let user = request.user as User;
            let day = await Day.GetDay(date, user);
            await day.RefreshTagMealing(+mealingIdentity, user);
            return day;
        } catch {
            this.setStatus(500);
            return;
        }
    }
    @Security('Bearer', [])
    @Get('/finalize/{date}/{mealingIdentity}')
    public async FinalizeMealing(@Request() request, date: string, mealingIdentity: number): Promise<Day> {
        try {
            let user = request.user as User;
            let day = await Day.GetDay(date, user);
            await day.FinalizeMealing(+mealingIdentity, user);
            return day;
        } catch {
            this.setStatus(500);
            return;
        }
    }

}
