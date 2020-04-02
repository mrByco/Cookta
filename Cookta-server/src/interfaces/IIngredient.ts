import {IIngredientType} from "../models/ingredient-type/ingredient-type.interface";
import {IUnit} from "../models/unit/unit.interface";

export interface IIngredient {
    ingredientID: string,
    unit: string,
    value: number
}
export interface ICompleteIngredient {
    ingredientType: IIngredientType;
    unit: IUnit;
    value: number;
}
