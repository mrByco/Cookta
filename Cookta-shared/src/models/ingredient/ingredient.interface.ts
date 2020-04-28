import {IUnit} from "../unit/unit.interface";
import {IIngredientType} from "../ingredient-type/ingredient-type.interface";

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
