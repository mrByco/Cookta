import {Body, Controller, Get, Post, Put, Route, Tags} from "tsoa";
import {IStockItem} from "../interfaces/istock.item";
import {ISetStockItemRequest} from "../requests/set-stock-item.request";

@Route('/stock')
@Tags('Stock')
export class StockController extends Controller {
    @Get('/{owner}')
    public async GetAll(owner: string): Promise<void> {
    }
    @Post('/{owner}')
    public async SetItem(@Body() setRequest: ISetStockItemRequest, owner: string): Promise<void> {
    }
}

