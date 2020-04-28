import {IIngredient} from "cookta-shared/dist/models/ingredient/ingredient.interface";

export interface IShoppingList {
    IngredientsToBuy: IIngredient[];
    IngredientsCompleted: IIngredient[];
    FamilyId: string;
}
