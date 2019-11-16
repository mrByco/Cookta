import {Body, Controller, Delete, Get, Post, Request, Route, Security, Tags} from "tsoa";
import {Food} from "../models/food/food.model";
import {IUpdateFoodRequest} from "../requests/create.food.request";
import {User} from "../models/user.model";
import {ForeignFood} from "../models/food/food-foreign";
import {PersonalFood} from "../models/food/food-personal";

@Tags("Food")
@Route("/food")
export class FoodController extends Controller {
    @Security("Bearer", ['noauth'])
    @Get()
    public async GetFoods(@Request() request: any): Promise<ForeignFood[] | PersonalFood[]> {
        try{
            let user = request.user as User;
            return user ? await Food.ToSendableAll(await Food.GetAllOwnFoods(user), user) : await Food.GetAllFoods();
        }
        catch{
            this.setStatus(500);
        }
    }

    @Security("Bearer", ['noauth'])
    @Get('/{id}')
    public async GetFoodById(@Request() request: any, id: string): Promise<ForeignFood | PersonalFood> {
        try{
            let user = request.user as User;
            let food = await Food.GetFood(id, user);
            if (!food)
                this.setStatus(404);
            else
                return await food.ToSendable(user);
        } catch{
            this.setStatus(500);
        }
    }

    @Security("Bearer", [])
    @Get('/{from}/{count}')
    public async GetPublicFoodsIncremental(@Request() request: any, from: number, count: number): Promise<ForeignFood[] | PersonalFood[]> {
        try{
            let user = request.user as User;
            return await Food.ToSendableAll(await Food.GetIncremental(from, count, {published: true}), user);
        } catch{
            this.setStatus(500);
        }
    }

    @Security("Bearer", [])
    @Post("/")
    public async AddOrUpdateFood(@Body() updateFoodRequest: IUpdateFoodRequest, @Request() request: any): Promise<ForeignFood | PersonalFood> {
        try{
            let user = request.user as User;
            return await (await Food.UpdateFood(updateFoodRequest, user)).ToSendable(user);
        }
        catch{
            this.setStatus(500)
        }
    }

    @Security("Bearer", [])
    @Delete('/{id}')
    public async DeleteFood(@Request() request: any, id: string): Promise<ForeignFood | PersonalFood> {
        try{
            let user = request.user as User;
            if ((await Food.GetFood(id, user)).owner == user.sub) {
                return await (await Food.Delete(id, user)).ToSendable(user);
            } else {
                this.setStatus(401);
                return;
            }
        }catch{
            this.setStatus(500);
        }
    }

}
