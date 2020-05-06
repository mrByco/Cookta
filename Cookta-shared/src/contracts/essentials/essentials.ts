import {IRoute} from "waxen/dist/abstract/route.interface";
import {ERouteMethod} from "waxen/dist/route-method.enum";
import {ControllerData} from "waxen/dist/abstract/controller.interface";
import {IIngredient} from "../../models/ingredient/ingredient.interface";

const GetCurrentBaseList: IRoute<void, IIngredient[], void> = {method: ERouteMethod.GET, path: ''}
const SetBaseList: IRoute<IIngredient[], IIngredient[], void> = {method: ERouteMethod.POST, path: ''}


export const EssentialControllerData: ControllerData = {
    basepath: "baselist", name: "Essentials", routes: [GetCurrentBaseList, SetBaseList]
}
