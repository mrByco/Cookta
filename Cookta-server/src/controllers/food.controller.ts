import {Subscription} from "../models/subscription.model";
import {User} from "../models/user.model";
import {Controller} from "waxen/dist/deorators/controller";
import {Contracts} from "cookta-shared/src/contracts/contracts";
import {Security} from "waxen/dist/deorators/security";
import {ISendableFood} from "cookta-shared/src/models/food/food-sendable.interface";
import {IUpdateFoodRequest} from "cookta-shared/src/contracts/foods/update-food.request";
import {SendableFood} from "../models/food/food-sendable";
import {ProvideRequest} from "waxen/dist/deorators/provide-request";
import {NotFoundError} from "../helpers/error.helper";
import {Services} from "../Services";

@Controller(Contracts.Foods)
export class FoodController {



    @Security(true)
    public async GetPublicFoods(reqBody: void, user: User): Promise<ISendableFood[]> {
        try {
            return (await SendableFood.ToSendableAll(await Services.FoodService.GetAllPublicFoods(), user));
        }
        catch (error) {
            console.error("An error caught: " + error.message);
        }
    }

    @Security(true)
    public async GetCollectionFoods(reqBody: void, user: User): Promise<ISendableFood[]> {
        try {

            let foods = await Services.FoodService.GetCollectionForUser(user.sub, user.GetCurrentFamily());
            return (await SendableFood.ToSendableAll(foods, user));
        }
        catch (error) {
            console.error("An error caught: " + error.message);
        }
    }
    @Security(false)
    public async GetOwnFoods(reqBody: void, user: User): Promise<ISendableFood[]> {
        try {
            let foods = await Services.FoodService.GetAllOwnFoods(user.sub);
            return await SendableFood.ToSendableAll(foods, user);
        }
        catch (error) {
            console.error("An error caught: " + error.message);
        }
    }
    @Security(false)
    public async GetFamilyFoods(reqBody: void, user: User): Promise<ISendableFood[]> {
        try {
            let currentFamily = user.GetCurrentFamily();
            let familyFoods = await currentFamily.GetFamilyFoods();
            return (await SendableFood.ToSendableAll(familyFoods, user));
        }
        catch (error) {
            console.error("An error caught: " + error.message);
        }
    }
    @Security(false)
    public async GetSubscriptionFoods(reqBody: void, user: User): Promise<ISendableFood[]> {
        let foods = await Subscription.GetSubsFoodsOfUser(user.sub);
        return (await SendableFood.ToSendableAll(foods, user));
    }

    @Security(true)
    public async GetFoodById(reqBody: void, user: User, id: string): Promise<ISendableFood> {
        let food = await Services.FoodService.GetFoodForUser(id, user.sub);
        if (!food)
            throw NotFoundError();
        else
            return SendableFood.Create(food, user);
    }

    @Security(true)
    public async GetPublicFoodsIncremental(reqBody: void, user: User, from: number, count: number): Promise<ISendableFood[]> {
        try {
            return await SendableFood.ToSendableAll(await Services.FoodService.GetIncremental(from, count, { published: true }), user);
        } catch{

        }
    }

    @Security(false)
    public async AddOrUpdateFood(reqBody: IUpdateFoodRequest, user: User): Promise<ISendableFood> {
        return await (await Services.FoodService.UpdateFood(reqBody, user.sub)).ToSendable(user);
    }

    @Security(false)
    public async DeleteFood(reqBody: void, user: User, foodId: string): Promise<ISendableFood> {
        if ((await Services.FoodService.GetFoodForUser(foodId, user.sub)).owner == user.sub) {
            return await (await Services.FoodService.Delete(foodId, user.sub)).ToSendable(user);
        } else {
            return;
        }
    }


    @ProvideRequest()
    @Security(false)
    public async UploadImage(reqBody: void, user: User, request: any, foodVersionId: string): Promise<void> {
        if (!request.files['image']) {
            return;
        }
        await Services.FoodService.UploadImage(foodVersionId, request.files['image'].tempFilePath, user.sub);
    }

    @Security(false)
    public async DeleteImage(reqBody: void, user: User, foodVersionId: string): Promise<void> {
        await Services.FoodService.DeleteImage(foodVersionId, user.sub);
    }

    @Security(true)
    public async SearchFoods(reqBody: void, user: User, text: string, count: number): Promise<{ results: ISendableFood[] }> {
        if (count < 1) return { results: [] };
        return { results: await SendableFood.ToSendableAll(await Services.FoodService.FoodSearch(text, +count), user) };
    }
}
