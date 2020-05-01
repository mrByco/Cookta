import {ControllerData} from "waxen/dist/abstract/controller.interface";
import {IRoute} from "waxen/dist/abstract/route.interface";
import {ERouteMethod} from "waxen/dist/route-method.enum";
import {IDay} from "../../models/days/day.interface";


const GetDay: IRoute<void, IDay, {date: string}> = {method: ERouteMethod.GET, path: ''}
const SetDay: IRoute<void, IDay, {date: string}> = {method: ERouteMethod.PUT, path: ''}
const RefreshMeal: IRoute<void, IDay, {date: string, mealingIndex: number}> = {method: ERouteMethod.GET, path: ''}
const FinalizeMealing: IRoute<void, IDay, {date: string, mealingIdentity: number}> = {method: ERouteMethod.GET, path: 'finalize'}


export const DayControllerData: ControllerData = {
    basepath: "day", name: "Days", routes: [GetDay, SetDay, RefreshMeal, FinalizeMealing]
}
