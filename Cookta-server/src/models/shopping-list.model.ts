import {StoreItemBase} from "atomik/store-item/store-item-base";
import {IShoppingList} from "./shopping-list.interface";
import {IIngredient} from "../interfaces/IIngredient";

export class ShoppingList extends StoreItemBase implements IShoppingList {

    public FamilyId: string;
    public IngredientsCompleted: IIngredient[];
    public IngredientsToBuy: IIngredient[];

}
