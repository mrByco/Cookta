import {IIngredient} from '../ingredient/ingredient.interface';

export interface ICompletedShoppingItem {
    Ingredient: IIngredient,
    ShippingSectionId: string,
    Bought: { UnitId: string, Value: number }
}

export interface IShoppingList {
    IngredientsToBuy: IIngredient[];
    IngredientsCompleted: ICompletedShoppingItem[];
    IngredientsCanceled: IIngredient[]
    FamilyId: string;
    ShoppingFrom: number;
    ShoppingTo: number;
    CreatedOn: number;
}
