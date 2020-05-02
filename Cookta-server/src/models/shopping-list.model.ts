import {StoreItemBase} from "atomik/lib/store-item/store-item-base";
import {IIngredient} from "cookta-shared/src/models/ingredient/ingredient.interface";
import { IShoppingList } from 'cookta-shared/src/models/shopping-list/shopping-list.interface';

export class ShoppingList extends StoreItemBase implements IShoppingList {

    public FamilyId: string = null;
    public IngredientsCompleted: IIngredient[] = null;
    public IngredientsToBuy: IIngredient[] = null;

}
