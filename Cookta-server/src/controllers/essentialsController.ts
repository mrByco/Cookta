import {User} from "../models/user.model";
import {Services} from "../Services";
import {Controller} from "waxen/dist/deorators/controller";
import {Contracts} from "cookta-shared/src/contracts/contracts";
import {Security} from 'waxen/dist/deorators/security';
import {IIngredient} from "cookta-shared/src/models/ingredient/ingredient.interface";


@Controller(Contracts.Essentials)
export class EssentialsController {

    @Security(false)
    public async GetCurrentBaseList(reqBody: void, user: User): Promise<IIngredient[]> {
        let essentials = Services.EssentialsService.GetEssentials(user.GetCurrentFamily());
        if (!essentials) {
            essentials = Services.EssentialsService.CreateEssentials(user.GetCurrentFamily());
        }
        return essentials.Essentials;
    }
    @Security(false)
    public async SetBaseList(reqBody: IIngredient[], user: User): Promise<IIngredient[]> {
        let essentialItem = Services.EssentialsService.GetEssentials(user.GetCurrentFamily());
        if (!essentialItem)
            essentialItem = Services.EssentialsService.CreateEssentials(user.GetCurrentFamily());
        essentialItem.Essentials = reqBody;
        Services.EssentialsService.SaveItem(essentialItem);
        return essentialItem.Essentials;
    }

}
