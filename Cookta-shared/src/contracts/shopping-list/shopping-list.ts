import {IRoute} from 'waxen/dist/abstract/route.interface';
import {ERouteMethod} from 'waxen/dist/route-method.enum';
import {ControllerData} from 'waxen/dist/abstract/controller.interface';
import {IShoppingList} from '../../models/shopping-list/shopping-list.interface';

const GetShoppingList: IRoute<void, IShoppingList, { nextShopping: string }> = {method: ERouteMethod.GET, path: ''};
const SetComplete: IRoute<{ IngredientId: string, complete: boolean }, IShoppingList, void> = {method: ERouteMethod.PUT, path: 'complete'};
const SetCanceled: IRoute<{IngredientId: string, Canceled: boolean}, IShoppingList, void> = {method: ERouteMethod.PUT, path: 'canceled'};

const NewShoppingList: IRoute<{ cancelItems: boolean }, IShoppingList, void> = {method: ERouteMethod.PUT, path: 'new'};

export const ShoppingListControllerData: ControllerData = {
    basepath: "ShoppingList", name: "ShoppingList", routes: [GetShoppingList, SetComplete, SetCanceled, NewShoppingList]
}
