import {Food} from "../models/food/food.model";
import {User} from "../models/user.model";
import {Subscription} from "../models/subscription.model";
import { Contracts } from 'cookta-shared/src/contracts/contracts';
import {Controller} from "waxen/dist/deorators/controller";
import {Security} from "waxen/dist/deorators/security";
import { ISendableFood } from "cookta-shared/src/models/food/food-sendable.interface";


@Controller(Contracts.Subscription)
export class SubscriptionController {

    @Security(false)
    public async GetSubscribedFoods(reqBody: void, user: User): Promise<ISendableFood[]> {
        return Food.ToSendableAll(await Subscription.GetSubsFoodsOfUser(user), user);
    }

    @Security(false)
    public async SetSubscriptionState(reqBody: { foodId: string, state: boolean }, user: User): Promise<void> {
        if (!reqBody.state) {
            await Subscription.SetUserSubState(user, reqBody.foodId, reqBody.state);
            return;
        } else {
            let food = Food.GetFoodForUser(reqBody.foodId, user);
            if (food != null) {
                await Subscription.SetUserSubState(user, reqBody.foodId, reqBody.state);
            }
        }
    }

}
