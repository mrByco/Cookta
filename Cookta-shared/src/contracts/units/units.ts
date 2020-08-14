import {IRoute} from "waxen/dist/abstract/route.interface";
import {ERouteMethod} from "waxen/dist/route-method.enum";
import {ControllerData} from "waxen/dist/abstract/controller.interface";
import {IUnit} from "../../models/unit/unit.interface";
import {FixBadUnitRequest, GetBadUnitResponse} from "../unit-route/get-bad-units";

const GetAll: IRoute<void, IUnit[], void> = {method: ERouteMethod.GET, path: ''};
const GetBadUnits: IRoute<void, GetBadUnitResponse, void> = {method: ERouteMethod.GET, path: 'bad-units'};
const FixBadUnit: IRoute<FixBadUnitRequest, GetBadUnitResponse, void> = {method: ERouteMethod.POST, path: 'bad-units'};

export const UnitControllerData: ControllerData = {
    basepath: "unit", name: "Unit", routes: [GetAll, GetBadUnits, FixBadUnit]
}
