import {IRoute} from "waxen/dist/abstract/route.interface";
import {ERouteMethod} from "waxen/dist/route-method.enum";
import {ControllerData} from "waxen/dist/abstract/controller.interface";
import {IShoppingList} from "../../models/shopping-list/shopping-list.interface";

const GetShoppingList: IRoute<void, IShoppingList, { nextShopping: string }> = {method: ERouteMethod.GET, path: ''};

export const ShoppingListControllerData: ControllerData = {
    basepath: "ShoppingList", name: "ShoppingList", routes: [GetShoppingList]
}
