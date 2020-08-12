import {User} from '../../models/user.model';
import {Services} from '../../Services';
import {Controller} from 'waxen/dist/deorators/controller';
import {Contracts} from 'cookta-shared/src/contracts/contracts';
import {Security} from 'waxen/dist/deorators/security';
import {ICompletedShoppingItem, IShoppingList} from 'cookta-shared/src/models/shopping-list/shopping-list.interface';


@Controller(Contracts.ShoppingList)
export class ShoppingListController {
    @Security(false)
    public async GetShoppingList(reqBody: void, user: User, nextShopping: string): Promise<IShoppingList> {
        let family = user.GetCurrentFamily();
        let from = new Date(Date.now()).ToYYYYMMDDString();
        let list = await Services.ShoppingListService.GetShoppingList(family.Id.toHexString(), from, nextShopping);
        return list;
    }


    @Security(false)
    public async SetComplete(reqBody: { IngredientId: string, complete: boolean }, user: User): Promise<IShoppingList> {
        return Services.ShoppingListService
            .SetItemComplete(
                reqBody.IngredientId,
                reqBody.complete,
                user.GetCurrentFamily().Id.toHexString(),
                await Services.StorageService.GetSections(user.GetCurrentFamily().Id.toHexString()));
    }

    @Security(false)
    public async SetCanceled(reqBody: { IngredientId: string, Canceled: boolean }, user: User): Promise<IShoppingList> {
        return Services.ShoppingListService
            .SetItemCanceled(
                reqBody.IngredientId,
                reqBody.Canceled,
                user.GetCurrentFamily().Id.toHexString());
    }

    @Security(false)
    public async NewShoppingList(reqBody: { cancelItems: boolean }, user: User): Promise<IShoppingList> {
        return Services.ShoppingListService.NewShoppingList(user.GetCurrentFamily().Id.toHexString(), reqBody.cancelItems)
    }

    @Security(false)
    public async SetBoughtQuantity(reqBody: { Item: ICompletedShoppingItem }, user: User): Promise<void> {
        return await Services.ShoppingListService.SetCompleteQuantityAndTarget(user.GetCurrentFamily().Id.toHexString(), { ingredientID: reqBody.Item.Ingredient.ingredientID, value: reqBody.Item.Bought?.Value, unit: reqBody.Item.Bought?.UnitId }, reqBody.Item.ShippingSectionId);
    }
}
