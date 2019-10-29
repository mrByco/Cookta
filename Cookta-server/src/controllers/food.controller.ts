import {Body, Controller, Delete, Get, Post, Route, Tags} from "tsoa";
import {Food} from "../models/food.model";
import {IUpdateFoodRequest} from "../requests/create.food.request";

@Tags("Food")
@Route("/food")
export class FoodController extends Controller {
    @Get()
    public async GetFoods() : Promise<Food[]> {
        try{
            return await Food.GetAllFoods();
        }
        catch{
            this.setStatus(500);
        }
    }
    @Get('/{id}')
    public async GetFoodById(id: string): Promise<Food> {
        try{
            let food = await Food.GetFood(id);
            if (!food)
                this.setStatus(404);
            else
                return food;
        }
        catch{
            this.setStatus(500);
        }
    }
    @Get('/{from}/{count}')
    public async GetPublicFoodsIncremental(from: number, count: number): Promise<Food[]> {
        try{
            return await Food.GetIncremental(from, count, {published: true})
        }
        catch{
            this.setStatus(500);
        }
    }
    @Post("/{owner}")
    public async AddOrUpdateFood(@Body() request: IUpdateFoodRequest, owner: string) : Promise<Food> {
        try{
            return await Food.UpdateFood(request, owner);
        }
        catch{
            this.setStatus(500)
        }
    }
    @Delete('/{id}')
    public async DeleteFood(id: string): Promise<Food> {
        try{
            return await Food.Delete(id);
        }catch{
            this.setStatus(500);
        }
    }
}
