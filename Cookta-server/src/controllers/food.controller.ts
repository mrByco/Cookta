import {Body, Delete, Get, Post, Request} from "tsoa";
import {Food} from "../models/food/food.model";
import {Subscription} from "../models/subscription.model";
import {User} from "../models/user.model";
import {Controller} from "waxen/dist/deorators/controller";
import {Contracts} from "cookta-shared/dist/contracts/contracts";
import {Security} from "waxen/dist/deorators/security";

//@Tags("Food")
//@Route("/food")
@Controller(Contracts.Foods)
export class FoodController {
    @Security(true)
    @Get()
    public async GetPublicFoods(@Request() request: any): Promise<any[]> {
        try{
            let User = request.user as User;
            return (await Food.ToSendableAll(await Food.GetAllPublicFoods(), User));
        }
        catch (error){
            console.error("An error caught: " + error.message);
        }
    }

    @Security(true)
    @Get("/collection")
    public async GetCollectionFoods(@Request() request: any): Promise<any[]> {
        try{
            let User = request.user as User;
            let foods = await Food.GetCollectionForUser(User);
            return (await Food.ToSendableAll(foods, User));
        }
        catch (error){
            console.error("An error caught: " + error.message);
        }
    }
    @Security(false)
    @Get("/own")
    public async GetOwnFoods(@Request() request: any): Promise<any[]> {
        try{
            let User = request.user as User;
            let foods = await Food.GetAllOwnFoods(User);
            return await Food.ToSendableAll(foods, User);
        }
        catch (error){
            console.error("An error caught: " + error.message);
        }
    }
    @Security(false)
    @Get("/family")
    public async GetFamilyFoods(@Request() request: any): Promise<any[]> {
        try{
            let User = request.user as User;
            let currentFamily = User.GetCurrentFamily();
            let familyFoods = await currentFamily.GetFamilyFoods();
            return (await Food.ToSendableAll(familyFoods, User));
        }
        catch (error){
            console.error("An error caught: " + error.message);
        }
    }
    @Security(false)
    @Get("/subscription")
    public async GetSubscriptionFoods(@Request() request: any): Promise<any[]> {
        try{
            let User = request.user as User;
            let foods = await Subscription.GetSubsFoodsOfUser(User);
            return (await Food.ToSendableAll(foods, User));
        }
        catch (error){
            
            console.error("An error caught: " + error.message);
        }
    }

    @Security(true)
    @Get('/{id}')
    public async GetFoodById(@Request() request: any, id: string): Promise<any> {
        let User = request.user as User;
        let food = await Food.GetFoodForUser(id, User);
        if (!food)
            console.log();
        else
            console.log();
        try{
        } catch{
            
        }
    }

    @Security(true)
    @Get('/{from}/{count}')
    public async GetPublicFoodsIncremental(@Request() request: any, from: number, count: number): Promise<any[]> {
        try{
            let User = request.user as User;
            return await Food.ToSendableAll(await Food.GetIncremental(from, count, {published: true}), User);
        } catch{
            
        }
    }

    @Security(false)
    @Post("/")
    public async AddOrUpdateFood(@Body() updateFoodRequest: any, @Request() request: any): Promise<any> {
        let User = request.user as User;
        return await (await Food.UpdateFood(updateFoodRequest, User)).ToSendable(User);
        try{
        }
        catch{
            
        }
    }

    @Security(false)
    @Delete('/{foodId}')
    public async DeleteFood(@Request() request: any, foodId: string): Promise<any> {
        try{
            let User = request.user as User;
            if ((await Food.GetFoodForUser(foodId, User)).owner == User.sub) {
                return await (await Food.Delete(foodId, User)).ToSendable(User);
            } else {
                
                return;
            }
        }catch{
            
        }
    }


    @Security(false)
    @Post('/image/{foodVersionId}')
    public async UploadImage(@Request() request: any, foodVersionId: string){
        if (!request.files['image']) {
            
            return;
        }
        let User = request.user as User;
        await Food.UploadImage(foodVersionId, request.files['image'].tempFilePath, User);
    }

    @Security(false)
    @Delete('/image/{foodVersionId}')
    public async DeleteImage(@Request() request: any, foodVersionId: string){
        let User = request.user as User;
        let success = await Food.DeleteImage(foodVersionId, User);
        return;
    }
}
