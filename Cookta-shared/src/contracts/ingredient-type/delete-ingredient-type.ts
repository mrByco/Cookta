import {IIngredientType} from "../../models/ingredient-type/ingredient-type.interface";

export interface IDeleteIngredientTypeRequest {
    forced: boolean;
    descendentId: string;
    ingredientTypeId: string;
    migrateCustomUnits: boolean;
}

export interface IDeleteIngredientTypeResponse {
    success: boolean;
    references: number;
    ingredientTypeId: string;
    descendent: IIngredientType;
}
