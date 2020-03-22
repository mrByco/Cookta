import {Body, Controller, Get, Post, Request, Route, Security, Tags} from "tsoa";
import {IIngredient} from "../interfaces/IIngredient";
import {EssentialList} from "../models/essential-list.model";
import {User} from "../models/user.model";
import {Services} from "../Services";

@Route("/Baselist")
@Tags('Baselist')
export class BaselistController extends Controller {

    @Security('Bearer', [])
    @Get('/')
    public async GetCurrentBaseList(@Request() request: any): Promise<IIngredient[]> {
        let User = request.user as User;
        let essentials = Services.EssentialsService.GetEssentials(User.GetCurrentFamily());
        if (!essentials){
            essentials = Services.EssentialsService.CreateEssentials(User.GetCurrentFamily());
        }
        return essentials.Essentials;
    }
    @Security('Bearer', [])
    @Post('/')
    public async SetBaseList(@Request() request: any, @Body() data: IIngredient[]): Promise<IIngredient[]> {
        let User = request.user as User;
        let essentialItem = Services.EssentialsService.GetEssentials(User.GetCurrentFamily());
        if (!essentialItem)
            essentialItem = Services.EssentialsService.CreateEssentials(User.GetCurrentFamily());
        essentialItem.Essentials = data;
        essentialItem.Save();
        return essentialItem.Essentials;
    }

}
