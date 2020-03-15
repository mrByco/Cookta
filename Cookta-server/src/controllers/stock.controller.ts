import {Body, Controller, Delete, Get, Post, Put, Request, Route, Security, Tags} from "tsoa";
import {IStockItem} from "../interfaces/istock.item";
import {ISetStockItemRequest} from "../requests/set-stock-item.request";
import {StorageSection} from "../models/storage-section.model";
import {RequestHelper} from "../helpers/request.helper";
import {User} from "../models/user.model";
import {Services} from "../Services";
import {ObjectId} from "mongodb";
import {IIngredient} from "../interfaces/IIngredient";
import {IStorageSection} from "../interfaces/IStorageSection";

@Route('/stock')
@Tags('Stock')
export class StockController extends Controller {
    @Security("Bearer", [])
    @Get('/')
    public async GetAll(@Request() request: any): Promise<IStorageSection[]> {
        let user = request.user as User;
        let response = await RequestHelper.ExecuteRequest(this, () => {
            return Services.StorageService.GetSections(user);
        });
        response.forEach(f => delete response['connectedService']); //TODO implement a To Json method
        return response;
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
    public async EditSection(@Request() request: any, @Body() changeRequest: {sectionId: ObjectId, name?: string, foods: IIngredient[], general: IIngredient[], isBase: boolean}): Promise<IStorageSection> {
        let user = request.user as User;
        return await RequestHelper.ExecuteRequest(this, () => {
            return Services.StorageService.SetSection(user, changeRequest);
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
            return Services.StorageService.GetSections(user);
        });
    }
}

