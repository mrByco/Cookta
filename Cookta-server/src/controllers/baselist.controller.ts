import {Body, Controller, Get, Post, Route, Tags} from "tsoa";
import {BaselistItem} from "../models/baselist-item.model";
import {iIngredient} from "../interfaces/iingredient";

@Route("/Baselist")
@Tags('Baselist')
export class BaselistController extends Controller {
    @Get('/{owner}')
    public async GetAllByOwner(owner: string): Promise<BaselistItem[]> {
        try{
            return await BaselistItem.GetAllOfSub(owner);
        }
        catch{
            this.setStatus(500);
        }
    }
    @Post('/{owner}')
    public async SetListItem(owner: string, @Body() data: iIngredient): Promise<BaselistItem> {
        try{
            let changed: BaselistItem;
            if (data.value === 0)
                changed = await BaselistItem.DeleteItem(owner, data.ingredientID);
            else
                changed = await BaselistItem.SetItem(owner, data);
            return changed;
        }
        catch{
            this.setStatus(500);
        }
    }

}
