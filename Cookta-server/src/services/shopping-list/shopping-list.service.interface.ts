import {IShoppingList} from 'cookta-shared/src/models/shopping-list/shopping-list.interface';
import {IIngredient} from 'cookta-shared/src/models/ingredient/ingredient.interface';

export interface IShoppingListService {

    GetShoppingList(familyId: string, NextShoppingDate: string): Promise<IShoppingList>;
    GetReqList(familyId: string, NextShoppingDate: string): Promise<IIngredient[]>;
}
