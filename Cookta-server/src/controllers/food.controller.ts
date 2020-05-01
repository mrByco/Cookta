import {Delete, Get, Post} from "tsoa";
import {Food} from "../models/food/food.model";
import {Subscription} from "../models/subscription.model";
import {User} from "../models/user.model";
import {Controller} from "waxen/dist/deorators/controller";
import {Contracts} from "cookta-shared/dist/contracts/contracts";
import {Security} from "waxen/dist/deorators/security";
import {ISendableFood} from "cookta-shared/dist/models/food/food-sendable.interface";
import {IUpdateFoodRequest} from "cookta-shared/src/contracts/foods/update-food.request";
import {SendableFood} from "../models/food/food-sendable";
import {ProvideRequest} from "waxen/dist/deorators/provide-request";

@Controller(Contracts.Foods)
export class FoodController {

    private get NotFoundError(): Error {
        let error = new Error('Not found');
        error['code'] = 404
        return error;
    }

    @Security(true)
    @Get()
    public async GetPublicFoods(reqBody: void, user: User): Promise<ISendableFood[]> {
        try {
            return (await Food.ToSendableAll(await Food.GetAllPublicFoods(), user));
        }
        catch (error) {
            console.error("An error caught: " + error.message);
        }
    }

    @Security(true)
    @Get("/collection")
    public async GetCollectionFoods(reqBody: void, user: User): Promise<ISendableFood[]> {
        try {
            let foods = await Food.GetCollectionForUser(user);
            return (await Food.ToSendableAll(foods, user));
        }
        catch (error) {
            console.error("An error caught: " + error.message);
        }
    }
    @Security(false)
    @Get("/own")
    public async GetOwnFoods(reqBody: void, user: User): Promise<ISendableFood[]> {
        try {
            let foods = await Food.GetAllOwnFoods(user);
            return await Food.ToSendableAll(foods, user);
        }
        catch (error) {
            console.error("An error caught: " + error.message);
        }
    }
    @Security(false)
    @Get("/family")
    public async GetFamilyFoods(reqBody: void, user: User): Promise<ISendableFood[]> {
        try {
            let currentFamily = user.GetCurrentFamily();
            let familyFoods = await currentFamily.GetFamilyFoods();
            return (await Food.ToSendableAll(familyFoods, user));
        }
        catch (error) {
            console.error("An error caught: " + error.message);
        }
    }
    @Security(false)
    @Get("/subscription")
    public async GetSubscriptionFoods(reqBody: void, user: User): Promise<ISendableFood[]> {
        let foods = await Subscription.GetSubsFoodsOfUser(user);
        return (await Food.ToSendableAll(foods, user));
    }

    @Security(true)
    @Get('/{id}')
    public async GetFoodById(reqBody: void, user: User, id: string): Promise<ISendableFood> {
        let food = await Food.GetFoodForUser(id, user);
        if (!food)
            throw this.NotFoundError;
        else
            return SendableFood.Create(food, user);
    }

    @Security(true)
    @Get('/{from}/{count}')
    public async GetPublicFoodsIncremental(reqBody: void, user: User, from: number, count: number): Promise<ISendableFood[]> {
        try {
            return await Food.ToSendableAll(await Food.GetIncremental(from, count, { published: true }), user);
        } catch{

        }
    }

    @Security(false)
    @Post("/")
    public async AddOrUpdateFood(reqBody: IUpdateFoodRequest, user: User): Promise<ISendableFood> {
        return await (await Food.UpdateFood(reqBody, user)).ToSendable(user);
    }

    @Security(false)
    @Delete('/{foodId}')
    public async DeleteFood(reqBody: void, user: User, foodId: string): Promise<ISendableFood> {
        if ((await Food.GetFoodForUser(foodId, user)).owner == user.sub) {
            return await (await Food.Delete(foodId, user)).ToSendable(user);
        } else {
            return;
        }
    }


    @Security(false)
    @ProvideRequest()
    public async UploadImage(reqBody: void, user: User, request: any, foodVersionId: string): Promise<void> {
        if (!request.files['image']) {
            return;
        }
        await Food.UploadImage(foodVersionId, request.files['image'].tempFilePath, user);
    }

    @Security(false)
    @Delete('/image/{foodVersionId}')
    public async DeleteImage(reqBody: void, user: User, foodVersionId: string): Promise<void> {
        await Food.DeleteImage(foodVersionId, user);
    }
}
