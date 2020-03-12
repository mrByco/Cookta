import {Body, Controller, Get, Post, Route, Tags} from "tsoa";
import {BaselistItem} from "../models/baselist-item.model";
import {iIngredient} from "../interfaces/iingredient";

@Route("/ping")
@Tags('Ping')
export class PingController extends Controller {
    @Get('/')
    public async Ping(): Promise<string> {
        return 'OK';
    }
}
