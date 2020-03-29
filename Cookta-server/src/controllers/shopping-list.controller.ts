import {Controller, Get, Request, Route, Security} from "tsoa";
import {User} from "../models/user.model";
import {Services} from "../Services";
import {ShoppingList} from "../models/shopping-list.model";
import {IShoppingList} from "../models/shopping-list.interface";

@Route('ShoppingList')
export class ShoppingListController extends Controller {
    @Security('Bearer', [])
    @Get("/{nextShopping}")
    public async GetShoppingList(@Request() request: any, nextShopping: string): Promise<IShoppingList> {
        try{
            let user = request.user as User;
            let family = user.GetCurrentFamily();
            return Services.ShoppingListService.GetShoppingList(family, nextShopping);
        }
        catch (exception){
            console.log(exception);
            this.setStatus(500);
        }
    }
}
