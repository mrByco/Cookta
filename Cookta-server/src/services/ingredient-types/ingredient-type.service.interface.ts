import {IStoreService} from "atomik/store-service/store-service-interface";
import {IIngredientType} from "../../models/ingredient-type/ingredient-type.interface";
import {ISetIngredientTypeRequest} from "../../requests/set.ingredient-type.request";
import {IngredientType} from "../../models/ingredient-type/ingredient-type.model";

export interface IIngredientTypeService extends IStoreService<IIngredientType> {

    GetAllNotArhived(): IIngredientType[];
    SetIngredientType(request: ISetIngredientTypeRequest): IngredientType;
    DeleteIngredientType(guid: string): boolean;
}
