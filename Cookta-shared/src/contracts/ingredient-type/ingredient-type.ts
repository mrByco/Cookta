import {IRoute} from "waxen/dist/abstract/route.interface";
import {ERouteMethod} from "waxen/dist/route-method.enum";
import {ControllerData} from "waxen/dist/abstract/controller.interface";
import {IIngredientType} from "../../models/ingredient-type/ingredient-type.interface";
import {ISetIngredientTypeRequest} from "./set.ingredient-type.request";
import {IDeleteIngredientTypeRequest, IDeleteIngredientTypeResponse} from "./delete-ingredient-type";
import {CheckUnitRefResponse} from "./check-ingredient.contrats";
import {DeleteCustomUnitRequest} from "./delete-custom-unit";

const GetAll: IRoute<void, IIngredientType[], void> = {method: ERouteMethod.GET, path: ''}
const SetIngredient: IRoute<ISetIngredientTypeRequest, {all: IIngredientType[], created: IIngredientType}, void> = {method: ERouteMethod.POST, path: ''}
const DeleteIngredient: IRoute<IDeleteIngredientTypeRequest, IDeleteIngredientTypeResponse, void> = {method: ERouteMethod.DELETE, path: ''}
const GetUnitRefs: IRoute<void, CheckUnitRefResponse, {unitId: string}> = {method: ERouteMethod.GET, path: 'check'}
const DeleteCustomUnit: IRoute<DeleteCustomUnitRequest, boolean, void> = {method: ERouteMethod.PUT, path: 'delete/unit'}


export const IngredientTypeControllerData: ControllerData = {
    basepath: "ingredientType", name: "IngredientTypes", routes: [GetAll, SetIngredient, DeleteIngredient, GetUnitRefs, DeleteCustomUnit]
}
