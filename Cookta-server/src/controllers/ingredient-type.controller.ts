import {Services} from '../Services';
import {IIngredientDependendentObject} from "../interfaces/ingredient-dependency-object.interface";
import {Food} from "../models/food/food.model";
import {NotFoundError} from "../helpers/error.helper";
import {Controller} from 'waxen/dist/deorators/controller';
import {Contracts} from "cookta-shared/src/contracts/contracts";
import {Security} from 'waxen/dist/deorators/security';
import {IIngredientType} from "cookta-shared/src/models/ingredient-type/ingredient-type.interface";
import {ISetIngredientTypeRequest} from "cookta-shared/src/contracts/ingredient-type/set.ingredient-type.request";
import {User} from "../models/user.model";
import {
    IDeleteIngredientTypeRequest,
    IDeleteIngredientTypeResponse
} from "cookta-shared/src/contracts/ingredient-type/delete-ingredient-type";
import {CheckUnitRefResponse} from "cookta-shared/src/contracts/ingredient-type/check-ingredient.contrats";
import {DeleteCustomUnitRequest} from "cookta-shared/src/contracts/ingredient-type/delete-custom-unit";


@Controller(Contracts.IngredientType)
export class IngredientTypeController {
    public async GetAll(reqBody: void): Promise<IIngredientType[]> {
        return Services.IngredientTypeService.GetAllNotArhived();
    }

    @Security(false, 'edit-ingredients')
    public async SetIngredient(reqBody: ISetIngredientTypeRequest, user: User): Promise<{ all: IIngredientType[], created: IIngredientType }> {
        let result = { all: undefined, created: undefined };
        result.created = Services.IngredientTypeService.SetIngredientType(reqBody);
        result.all = await this.GetAll();
        return result;
    }

    @Security(false, 'delete-ingredients')
    public async DeleteIngredient(reqBody: IDeleteIngredientTypeRequest, user: User): Promise<IDeleteIngredientTypeResponse> {
        let dependencies: IIngredientDependendentObject =
        {
            essentials: Services.EssentialsService.GetAllItems(),
            storages: Services.StorageService.GetAllItems(),
            foods: await Food.GetAllFoods({})
        }

        let success = await Services.IngredientTypeService.DeleteIngredientType(reqBody.ingredientTypeId, reqBody.forced, reqBody.descendentId, dependencies);


        let descendent = Services.IngredientTypeService.FindOne(i => i.guid == reqBody.descendentId);
        if (success) {
            return {
                success: true,
                descendent: descendent,
                ingredientTypeId: reqBody.ingredientTypeId,
                references: undefined
            }
        } else {
            let references =
                await Services.IngredientTypeService.GetIngredientReferenceCount(reqBody.ingredientTypeId, dependencies)
            return {
                success: false,
                descendent: descendent,
                ingredientTypeId: reqBody.ingredientTypeId,
                references: references
            }
        }
    }

    @Security(false, 'advanced-ingredients')
    public async GetUnitRefs(reqBody: void, user: User, unitId: string): Promise<CheckUnitRefResponse> {
        let refs = await Services.IngredientTypeService.CheckUnitReferences(unitId);
        return {
            totalRefs: refs.essentials + refs.storage + refs.foods,
            essentialsRefs: refs.essentials,
            foodRefs: refs.foods,
            storageRefs: refs.storage,
            unitId: unitId

        };
    }

    @Security(false, 'advanced-ingredients')
    public async DeleteCustomUnit(reqBody: DeleteCustomUnitRequest, user: User): Promise<boolean> {
        try {
            await Services.IngredientTypeService.DeleteCustomUnit(reqBody.ingredientTypeId, reqBody.unitToDeleteId, reqBody.descendent);
            return true;
        } catch (error) {
            if (error.name == 'NOT_EXIST') {
                throw NotFoundError();
            } else {
                throw error;
            }
        }
    }

}
