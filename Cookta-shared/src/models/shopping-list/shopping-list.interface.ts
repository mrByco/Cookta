import {IIngredient} from "../ingredient/ingredient.interface";

export interface IShoppingList {
    IngredientsToBuy: IIngredient[];
    IngredientsCompleted: IIngredient[];
    FamilyId: string;
}
