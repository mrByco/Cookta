import {StoreItemBase} from "atomik/lib/store-item/store-item-base";
import {IShoppingList} from "./shopping-list.interface";
import {IIngredient} from "cookta-shared/dist/models/ingredient/ingredient.interface";

export class ShoppingList extends StoreItemBase implements IShoppingList {

    public FamilyId: string = null;
    public IngredientsCompleted: IIngredient[] = null;
    public IngredientsToBuy: IIngredient[] = null;

}
