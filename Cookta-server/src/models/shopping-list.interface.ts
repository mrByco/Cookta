import {IIngredient} from "cookta-shared/src/models/ingredient/ingredient.interface";

export interface IShoppingList {
    IngredientsToBuy: IIngredient[];
    IngredientsCompleted: IIngredient[];
    FamilyId: string;
}
