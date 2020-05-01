import {IRoute} from "waxen/dist/abstract/route.interface";
import {ERouteMethod} from "waxen/dist/route-method.enum";
import {ControllerData} from "waxen/dist/abstract/controller.interface";
import {ISendableFood} from "../../models/food/food-sendable.interface";

const GetSubscribedFoods: IRoute<void, ISendableFood[], void> = {method: ERouteMethod.GET, path: ''};
const SetSubscriptionState: IRoute<{foodId: string, state: boolean}, void, void> = {method: ERouteMethod.PUT, path: ''};

export const SubscriptionControllerData: ControllerData = {
    basepath: "subscription", name: "Subscription", routes: [GetSubscribedFoods, SetSubscriptionState]
}
