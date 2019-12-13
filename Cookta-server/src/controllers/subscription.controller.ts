import {Body, Controller, Get, Put, Request, Route, Security, Tags} from "tsoa";
import {Food} from "../models/food/food.model";
import {User} from "../models/user.model";
import {Subscription} from "../models/subscription.model";

@Route('/subscription')
@Tags('Subscription')
export class  SubscriptionController extends Controller {
    @Get()
    @Security('Bearer', [])
    public async GetSubscribedFoods(@Request() request: any): Promise<Food[]>{
        let user = request.user as User;
        return await Subscription.GetSubsFoodsOfUser(user);
    }

    @Put()
    @Security('Bearer', [])
    public async SetSubscriptionState(@Request() request: any, @Body() body: {foodId: string, state: boolean}){
        let user = request.user as User;
        if (!body.state){
            await Subscription.SetUserSubState(user, body.foodId, body.state);
            this.setStatus(200);
            return;
        }else{
            let food = Food.GetFoodForUser(body.foodId, user);
            if (food != null){
                await Subscription.SetUserSubState(user, body.foodId, body.state);
            }
        }
    }

}
