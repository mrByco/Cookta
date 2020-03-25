import {Controller, Get, Route, Tags} from "tsoa";
import {Unit} from "../models/unit.model";

@Route('/unit')
@Tags('Unit')
export class UnitController extends Controller {
    @Get()
    public async GetAll(): Promise<Unit[]> {
        try{
            return await Unit.GetAll();
        }catch{
            this.setStatus(500);
        }
    }
}
