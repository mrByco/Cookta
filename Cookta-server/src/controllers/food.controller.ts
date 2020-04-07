import {Body, Controller, Delete, Get, Post, Request, Route, Security, Tags} from "tsoa";
import {IUpdateFoodRequest} from "../requests/create.food.request";
import {User} from "../models/User.model";
import {SendableFood} from "../models/food/food-sendable";
import {Food} from "../models/food/food.model";
import {Subscription} from "../models/subscription.model";

@Tags("Food")
@Route("/food")
export class FoodController extends Controller {
    @Security("Bearer", ['noauth'])
    @Get()
    public async GetPublicFoods(@Request() request: any): Promise<SendableFood[]> {
        try{
            let User = request.user as User;
            return (await Food.ToSendableAll(await Food.GetAllPublicFoods(), User));
        }
        catch (error){
            this.setStatus(500);
            console.error("An error caught: " + error.message);
        }
    }

    @Security("Bearer", [])
    @Get("/collection")
    public async GetCollectionFoods(@Request() request: any): Promise<SendableFood[]> {
        try{
            let User = request.user as User;
            let foods = await Subscription.GetSubsFoodsOfUser(User);
            foods = foods.concat(await Food.GetAllOwnFoods(User));
            foods = foods.concat(await User.GetCurrentFamily().GetFamilyFoods());
            return (await Food.ToSendableAll(foods, User));
        }
        catch (error){
            this.setStatus(500);
            console.error("An error caught: " + error.message);
        }
    }
    @Security("Bearer", [])
    @Get("/own")
    public async GetOwnFoods(@Request() request: any): Promise<SendableFood[]> {
        try{
            let User = request.user as User;
            let foods = await Food.GetAllOwnFoods(User);
            return await Food.ToSendableAll(foods, User);
        }
        catch (error){
            this.setStatus(500);
            console.error("An error caught: " + error.message);
        }
    }
    @Security("Bearer", [])
    @Get("/family")
    public async GetFamilyFoods(@Request() request: any): Promise<SendableFood[]> {
        try{
            let User = request.user as User;
            let currentFamily = User.GetCurrentFamily();
            let familyFoods = await currentFamily.GetFamilyFoods();
            return (await Food.ToSendableAll(familyFoods, User));
        }
        catch (error){
            this.setStatus(500);
            console.error("An error caught: " + error.message);
        }
    }
    @Security("Bearer", [])
    @Get("/subscription")
    public async GetSubscriptionFoods(@Request() request: any): Promise<SendableFood[]> {
        try{
            let User = request.user as User;
            let foods = await Subscription.GetSubsFoodsOfUser(User);
            return (await Food.ToSendableAll(foods, User));
        }
        catch (error){
            this.setStatus(500);
            console.error("An error caught: " + error.message);
        }
    }

    @Security("Bearer", ['noauth'])
    @Get('/{id}')
    public async GetFoodById(@Request() request: any, id: string): Promise<SendableFood> {
        let User = request.user as User;
        let food = await Food.GetFoodForUser(id, User);
        if (!food)
            this.setStatus(404);
        else
            return await food.ToSendable(User);
        try{
        } catch{
            this.setStatus(500);
        }
    }

    @Security("Bearer", [])
    @Get('/{from}/{count}')
    public async GetPublicFoodsIncremental(@Request() request: any, from: number, count: number): Promise<SendableFood[]> {
        try{
            let User = request.user as User;
            return await Food.ToSendableAll(await Food.GetIncremental(from, count, {published: true}), User);
        } catch{
            this.setStatus(500);
        }
    }

    @Security("Bearer", [])
    @Post("/")
    public async AddOrUpdateFood(@Body() updateFoodRequest: IUpdateFoodRequest, @Request() request: any): Promise<SendableFood> {
        let User = request.user as User;
        return await (await Food.UpdateFood(updateFoodRequest, User)).ToSendable(User);
        try{
        }
        catch{
            this.setStatus(500)
        }
    }

    @Security("Bearer", [])
    @Delete('/{foodId}')
    public async DeleteFood(@Request() request: any, foodId: string): Promise<SendableFood> {
        try{
            let User = request.user as User;
            if ((await Food.GetFoodForUser(foodId, User)).owner == User.sub) {
                return await (await Food.Delete(foodId, User)).ToSendable(User);
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
        let User = request.user as User;
        await Food.UploadImage(foodVersionId, request.files['image'].tempFilePath, User);
    }

    @Security('Bearer', [])
    @Delete('/image/{foodVersionId}')
    public async DeleteImage(@Request() request: any, foodVersionId: string){
        let User = request.user as User;
        let success = await Food.DeleteImage(foodVersionId, User);
        success ? this.setStatus(200) : this.setStatus(403);
        return;
    }
}
