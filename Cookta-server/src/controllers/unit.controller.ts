import {Body, Controller, Get, Post, Route, Security, Tags} from "tsoa";
import {Unit} from "../models/unit/unit.model";
import {Services} from "../Services";
import {IUnit} from "../../../Cookta-shared/src/models/unit/unit.interface";
import {FixBadUnitRequest, GetBadUnitResponse} from "../../../Cookta-shared/src/contracts/unit-route/get-bad-units";
import {Food} from "../models/food/food.model";
import {IBadUnit} from "../../../Cookta-shared/src/models/unit/bad-unit.interface";

@Route('/unit')
@Tags('Unit')
export class UnitController extends Controller {
    @Get()
    public async GetAll(): Promise<any[]> {
        try{
            return Services.UnitService.GetAllItems();
        }catch{
            this.setStatus(500);
        }
    }
    

    @Security('Bearer', ['advanced-ingredients'])
    @Get('bad-units')
    public async GetBedUnits(): Promise<any> {
        try {
            let foods = await Food.GetAllFoods({});
            let unitRefs: IBadUnit[] = await Services.UnitService.GetBadUnitReferences(
                Services.EssentialsService.GetAllItems(),
                Services.StorageService.GetAllItems(),
                foods);
            return {badUnits: unitRefs};
        } catch (error) {
            this.setStatus(500);
            console.error(error);
        }
    }

    //Should return the remaining unit list.
    @Security('Bearer', ['advanced-ingredients'])
    @Post('bad-units')
    public async FixBedUnit(@Body() reqBody: any): Promise<any> {
        let foods: Food[] = [];
        try {
            foods = await Food.GetAllFoods({});
            if (reqBody.badUnit.Fix && reqBody.badUnit.FixUnit) {
                let ingredientType = Services.IngredientTypeService.FindOne(i => i.guid == reqBody.badUnit.IngredientId);
                let fixUnit = Services.UnitService.GetAvailableUnitsForType(ingredientType).find(u => u.id == reqBody.badUnit.FixUnit);

                await Services.UnitService.FixBadUnit(
                    reqBody.badUnit.UnitId,
                    reqBody.badUnit.IngredientId,
                    fixUnit,
                    reqBody.badUnit.Fix,
                    Services.EssentialsService.GetAllItems(),
                    Services.StorageService.GetAllItems(),
                    foods);
            }
        } catch (error) {
            this.setStatus(500);
            console.error(error);
            return;
        }

        return {
            badUnits: await Services.UnitService.GetBadUnitReferences(
                Services.EssentialsService.GetAllItems(),
                Services.StorageService.GetAllItems(),
                foods)
        };
    }
}
