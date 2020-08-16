import {IIngredient} from '../ingredient/ingredient.interface';

export interface ICompletedShoppingItem {
    Ingredient: IIngredient,
    ShippingSectionId: string,
    Bought?: { UnitId: string, Value: number }
}

export interface IShoppingIngredient extends IIngredient {
    Relatives: {
        SectionItems: {sectionId: string, ingredient: IIngredient}[];
        MenuItems: {day: string, food: string, dose: number, ingredient: IIngredient}[];
        EssentialItems: {ingredient: IIngredient}[];
    };
}

export interface IShoppingList {
    IngredientsToBuy: IShoppingIngredient[];
    IngredientsCompleted: ICompletedShoppingItem[];
    IngredientsCanceled: IIngredient[]
    FamilyId: string;
    ShoppingFrom: number;
    ShoppingTo: number;
    CreatedOn: number;
}
