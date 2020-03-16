import {Body, Controller, Delete, Get, Post, Put, Request, Route, Security, Tags} from "tsoa";
import {ISetStockItemRequest} from "../requests/set-stock-item.request";
import {StorageSection} from "../models/storage-section.model";
import {RequestHelper} from "../helpers/request.helper";
import {User} from "../models/user.model";
import {Services} from "../Services";
import {ObjectId} from "mongodb";
import {IIngredient} from "../interfaces/IIngredient";
import {IStorageSection} from "../interfaces/IStorageSection";
import {IStorageItemChangeRequest} from "../interfaces/StorageItemChange.request";

@Route('/stock')
@Tags('Stock')
export class StockController extends Controller {
    @Security("Bearer", [])
    @Get('/')
    public async GetAll(@Request() request: any): Promise<any> {
        let user = request.user as User;
        let items = await RequestHelper.ExecuteRequest(this, () => {
            let i =  Services.StorageService.GetSections(user);
            console.log(i);
            return i;
        });
        return Services.ToSendableList(items);
    }
    @Security("Bearer", [])
    @Post('/')
    public async CreateSection(@Request() request: any): Promise<void> {
        let user = request.user as User;
        return await RequestHelper.ExecuteRequest(this, () => {
            return Services.StorageService.CreateSection(user);
        });
    }
    @Security("Bearer", [])
    @Put('/')
    public async EditSection(@Request() request: any, @Body() changeRequest: IStorageItemChangeRequest): Promise<IStorageSection> {
        let user = request.user as User;
        return await RequestHelper.ExecuteRequest(this, () => {
            return Services.StorageService.SetSection(user, changeRequest).ToSendJson();
        });
    }
    @Security("Bearer", [])
    @Delete('/{sectionIdString}')
    public async DeleteSection(@Request() request: any, sectionIdString: string): Promise<IStorageSection[]> {
        let sectionId;
        try{
            sectionId = new ObjectId(sectionIdString);
        }catch{
            this.setStatus(404);
            return;
        }
        let user = request.user as User;
        return await RequestHelper.ExecuteRequest(this, () => {
            Services.StorageService.DeleteSection(user, sectionId);
            return Services.ToSendableList(Services.StorageService.GetSections(user));
        });
    }
}

