import {Body, Controller, Get, Post, Put, Route, Tags} from "tsoa";
import {IStockItem} from "../interfaces/istock.item";
import {Stock} from "../models/stock.model";
import {ISetStockItemRequest} from "../requests/set-stock-item.request";

@Route('/stock')
@Tags('Stock')
export class StockController extends Controller {
    @Get('/{owner}')
    public async GetAll(owner: string): Promise<IStockItem[]> {
        try{
            let stock = await Stock.GetStockOfSub(owner);
            return stock.items;
        }catch{
            this.setStatus(500);
        }
    }
    @Post('/{owner}')
    public async SetItem(@Body() setRequest: ISetStockItemRequest, owner: string): Promise<IStockItem[]> {
        try{

            let stock = await Stock.GetStockOfSub(owner);
            //Zero value deletes the item

            if (setRequest.value == 0)
                await stock.Delete(setRequest.typeId);
            else if (!stock.items.find(i => i.typeid == setRequest.typeId))
                await stock.Add({typeid: setRequest.typeId, value: setRequest.value, unitId: setRequest.unitId, type: setRequest.type});
            else
                await stock.Update(setRequest);

            return stock.items;
        }catch{
            this.setStatus(500);
        }
    }
}
