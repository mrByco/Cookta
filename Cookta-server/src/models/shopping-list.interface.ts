import {IIngredient} from "../interfaces/IIngredient";

export interface IShoppingList {
    IngredientsToBuy: IIngredient[];
    IngredientsCompleted: IIngredient[];
    FamilyId: string;
}
