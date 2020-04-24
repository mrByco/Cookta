import {Controller, Get, Route, Security, Tags} from "tsoa";
import {Unit} from "../models/unit/unit.model";
import {Services} from "../Services";
import {IUnit} from "../../../Cookta-shared/src/models/unit/unit.interface";
import {GetBadUnitResponse} from "../../../Cookta-shared/src/contracts/unit-route/get-bad-units";
import {Food} from "../models/food/food.model";
import {IBadUnit} from "../../../Cookta-shared/src/models/unit/bad-unit.interface";

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
    
    
    @Security('Bearer', ['advanced-ingredients'])
    @Get('bad-units')
    public async GetBedUnits(): Promise<GetBadUnitResponse> {
        try {
            let foods = await Food.GetAllFoods({});
            let unitRefs: IBadUnit[] = await Services.UnitService.GetBadUnitReferences(
                Services.EssentialsService.GetAllItems(),
                Services.StorageService.GetAllItems(),
                foods);
            return {badUnits: unitRefs};
        }
        catch (error){
            this.setStatus(500);
            console.error(error);
        }
    }
}
