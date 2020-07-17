import {IShoppingList} from 'cookta-shared/src/models/shopping-list/shopping-list.interface';
import {IIngredient} from 'cookta-shared/src/models/ingredient/ingredient.interface';

export interface IShoppingListService {

    GetShoppingList(familyId: string, from: string, to: string): Promise<IShoppingList>;
    GetReqList(familyId: string, from: string, to: string): Promise<IIngredient[]>;
    SetItemComplete(ingredientId: string, completed: boolean, familyId: string);
    SetItemCanceled(ingredientId: string, canceled: boolean, familyId: string);
    //Cancels the completed items.
    NewShoppingList(familyId: string);
    FinishItems(familyId: string);

}
