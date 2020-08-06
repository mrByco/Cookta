import {IRoute} from 'waxen/dist/abstract/route.interface';
import {ERouteMethod} from 'waxen/dist/route-method.enum';
import {ControllerData} from 'waxen/dist/abstract/controller.interface';
import {INutrientInfo} from "../../models/nutrient-info";


//Unsecured
const GetAllNutrients: IRoute<void, INutrientInfo[], void> = {method: ERouteMethod.GET, path: ''};

export const NutrientControllerData: ControllerData = {
    basepath: 'nutrients',
    name: 'NutrientController',
    routes: [GetAllNutrients]
};
