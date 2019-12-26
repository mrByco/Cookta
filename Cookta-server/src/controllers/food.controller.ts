import {Body, Controller, Delete, Get, Post, Request, Route, Security, Tags} from "tsoa";
import * as multer from 'multer';
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
    public async GetPublicFoods(@Request() request: any): Promise<ForeignFood[] | PersonalFood[]> {
        try{
            let user = request.user as User;
            return (await Food.ToSendableAll(await Food.GetAllPublicFoods(), user));
        }
        catch (error){
            this.setStatus(500);
            console.error("An error caught: " + error.message);
        }
    }

    

    @Security("Bearer", ['noauth'])
    @Get('/{id}')
    public async GetFoodById(@Request() request: any, id: string): Promise<ForeignFood | PersonalFood> {
        let user = request.user as User;
        let food = await Food.GetFoodForUser(id, user);
        if (!food)
            this.setStatus(404);
        else
            return await food.ToSendable(user);
        try{
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
        let user = request.user as User;
        return await (await Food.UpdateFood(updateFoodRequest, user)).ToSendable(user);
        try{
        }
        catch{
            this.setStatus(500)
        }
    }

    @Security("Bearer", [])
    @Delete('/{foodId}')
    public async DeleteFood(@Request() request: any, foodId: string): Promise<ForeignFood | PersonalFood> {
        try{
            let user = request.user as User;
            if ((await Food.GetFoodForUser(foodId, user)).owner == user.sub) {
                return await (await Food.Delete(foodId, user)).ToSendable(user);
            } else {
                this.setStatus(401);
                return;
            }
        }catch{
            this.setStatus(500);
        }
    }


    @Security('Bearer', [])
    @Post('/image/{foodVersionId}')
    public async UploadImage(@Request() request: any, foodVersionId: string){
        if (!request.files['image']) {
            this.setStatus(400);
            return;
        }
        let user = request.user as User;
        await Food.UploadImage(foodVersionId, request.files['image'].tempFilePath, user);
    }

    @Security('Bearer', [])
    @Delete('/image/{foodVersionId}')
    public async DeleteImage(@Request() request: any, foodVersionId: string){
        let user = request.user as User;
        let success = await Food.DeleteImage(foodVersionId, user);
        success ? this.setStatus(200) : this.setStatus(403);
        return;
    }


}
