import {Controller, Get, Route, Tags} from "tsoa";
import {Unit} from "../models/unit/unit.model";
import {Services} from "../Services";
import {IUnit} from "../models/unit/unit.interface";
import show = Mocha.reporters.Base.cursor.show;

@Route('/unit')
@Tags('Unit')
export class UnitController extends Controller {
    @Get()
    public async GetAll(): Promise<IUnit[]> {
        try{
            return Services.UnitService.GetAllItems();
        }catch{
            this.setStatus(500);
        }
    }
}
