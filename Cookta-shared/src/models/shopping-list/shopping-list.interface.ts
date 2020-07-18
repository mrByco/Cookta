import {IIngredient} from '../ingredient/ingredient.interface';

export interface IShoppingList {
    IngredientsToBuy: IIngredient[];
    IngredientsCompleted: {Indredient: IIngredient, ShippingSectionId: string}[];
    IngredientsCanceled: IIngredient[]
    FamilyId: string;
    ShoppingFrom: number;
    ShoppingTo: number;
    CreatedOn: number;
}
