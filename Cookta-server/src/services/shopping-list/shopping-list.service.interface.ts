import {IShoppingList} from 'cookta-shared/src/models/shopping-list/shopping-list.interface';
import {IIngredient} from 'cookta-shared/src/models/ingredient/ingredient.interface';
import {IStorageSection} from 'cookta-shared/src/models/storage-sections/storage-section.interface';

export interface IShoppingListService {

    GetShoppingList(familyId: string, from: string, to: string): Promise<IShoppingList>;
    GetReqList(familyId: string, from: string, to: string): Promise<IIngredient[]>;
    SetItemComplete(ingredientId: string, completed: boolean, familyId: string, familyStorages: IStorageSection[]): Promise<IShoppingList>;
    SetItemCanceled(ingredientId: string, canceled: boolean, familyId: string): Promise<IShoppingList>;
    //Cancels the completed items.
    NewShoppingList(familyId: string, itemsToStorage?: boolean): Promise<IShoppingList>;

}
