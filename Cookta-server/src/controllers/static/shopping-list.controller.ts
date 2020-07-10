import {User} from '../../models/user.model';
import {Services} from '../../Services';
import {Controller} from 'waxen/src/deorators/controller';
import {Contracts} from 'cookta-shared/src/contracts/contracts';
import {Security} from 'waxen/src/deorators/security';
import {IShoppingList} from 'cookta-shared/src/models/shopping-list/shopping-list.interface';


@Controller(Contracts.ShoppingList)
export class ShoppingListController {
    @Security(false)
    public async GetShoppingList(reqBody: void, user: User, nextShopping: string): Promise<IShoppingList> {
        let family = user.GetCurrentFamily();
        return Services.ShoppingListService.GetShoppingList(family, nextShopping);
    }
}
