import {Body, Controller, Get, Post, Route, Tags} from "tsoa";
import {BaselistItem} from "../models/baselist-item.model";
import {IIngredient} from "../interfaces/IIngredient";

@Route("/ping")
@Tags('Ping')
export class PingController extends Controller {
    @Get('/')
    public async Ping(): Promise<string> {
        return 'OK';
    }
}
