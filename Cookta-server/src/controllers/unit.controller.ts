import {Services} from "../Services";
import {Food} from "../models/food/food.model";
import {IBadUnit} from "cookta-shared/src/models/unit/bad-unit.interface";
import {Controller} from "waxen/dist/deorators/controller";
import {Contracts} from 'cookta-shared/src/contracts/contracts';
import {Security} from "waxen/dist/deorators/security";
import {IUnit} from "cookta-shared/src/models/unit/unit.interface";
import {FixBadUnitRequest, GetBadUnitResponse} from "cookta-shared/src/contracts/unit-route/get-bad-units";
import { User } from "../models/user.model";

@Controller(Contracts.Units)
export class UnitController {

    public async GetAll(reqBody: void): Promise<IUnit[]> {
        return Services.UnitService.GetAllItems();
    }

    @Security(false, 'advanced-ingredients')
    public async GetBadUnits(reqBody: void, user: User): Promise<GetBadUnitResponse> {
        let foods = await Services.FoodService.GetAllFoods({});
        let unitRefs: IBadUnit[] = await Services.UnitService.GetBadUnitReferences(
            Services.EssentialsService.GetAllItems(),
            Services.StorageService.GetAllItems(),
            foods);
        return { badUnits: unitRefs };
    }

    //Should return the remaining unit list.
    @Security(false, 'advanced-ingredients')
    public async FixBadUnit(reqBody: FixBadUnitRequest, user: User): Promise<GetBadUnitResponse> {
        let foods: Food[] = [];
        foods = await Services.FoodService.GetAllFoods({});
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

        return {
            badUnits: await Services.UnitService.GetBadUnitReferences(
                Services.EssentialsService.GetAllItems(),
                Services.StorageService.GetAllItems(),
                foods)
        };
    }


}
