import {Body, Controller, Delete, Get, Post, Put, Route, Security, Tags} from 'tsoa';
import {IngredientType} from '../models/ingredient-type/ingredient-type.model';
import {ISetIngredientTypeRequest} from '../requests/set.ingredient-type.request';
import {Services} from '../Services';
import {IIngredientType} from "cookta-shared/dist/models/ingredient-type/ingredient-type.interface";
import {CheckUnitRefResponse} from "cookta-shared/dist/contracts/ingredient-type/check-ingredient.contrats";
import {DeleteCustomUnitRequest} from "cookta-shared/dist/contracts/ingredient-type/delete-custom-unit";
import {
    IDeleteIngredientTypeRequest,
    IDeleteIngredientTypeResponse
} from "cookta-shared/dist/contracts/ingredient-type/delete-ingredient-type";
import {IIngredientDependencyObject} from "../interfaces/ingredient-dependency-object.interface";
import {Service} from "@azure/storage-blob/typings/src/generated/src/operations";
import {Food} from "../models/food/food.model";

@Route('/ingredientType')
@Tags('IngredientType')
export class IngredientTypeController extends Controller {
    @Get()
    public async GetAll(): Promise<IIngredientType[]> {
        try {
            return Services.IngredientTypeService.GetAllNotArhived();
        } catch {
            this.setStatus(500);
        }
    }

    @Security('Bearer', ['edit-ingredients'])
    @Post()
    public async SetIngredient(@Body() request: ISetIngredientTypeRequest): Promise<{ all: IIngredientType[], created: IIngredientType }> {
        let result = {all: undefined, created: undefined};
        result.created = Services.IngredientTypeService.SetIngredientType(request);
        result.all = await this.GetAll();
        return result;
        try {
        } catch {
            this.setStatus(500);
        }
    }

    @Security('Bearer', ['delete-ingredients'])
    @Delete('/')
    public async DeleteIngredient(@Body() deleteBody: IDeleteIngredientTypeRequest): Promise<IDeleteIngredientTypeResponse> {
        try {
            let dependencies: IIngredientDependencyObject =
                {
                    essentials: Services.EssentialsService.GetAllItems(),
                    storages: Services.StorageService.GetAllItems(),
                    foods: await Food.GetAllFoods({})
                }

            let success = await Services.IngredientTypeService.DeleteIngredientType(deleteBody.ingredientTypeId, deleteBody.forced, deleteBody.descendentId, dependencies);


            let descendent = Services.IngredientTypeService.FindOne(i => i.guid == deleteBody.descendentId);
            if (success){
                return {success: true, descendent: descendent, ingredientTypeId: deleteBody.ingredientTypeId, references: undefined}
            }else{
                let references =
                    await Services.IngredientTypeService.GetIngredientReferenceCount(deleteBody.ingredientTypeId, dependencies)
                return {success: false, descendent: descendent, ingredientTypeId: deleteBody.ingredientTypeId, references: references}
            }
        } catch {
            this.setStatus(500);
        }
    }


    @Security('Bearer', ['advanced-ingredients'])
    @Get('/check/unit/{unitId}')
    public async GetUnitRefs(unitId: string): Promise<CheckUnitRefResponse> {
        let refs = await Services.IngredientTypeService.CheckUnitReferences(unitId);
        return {
            totalRefs: refs.essentials + refs.storage + refs.foods,
            essentialsRefs: refs.essentials,
            foodRefs: refs.foods,
            storageRefs: refs.storage,
            unitId: unitId

        };
    }

    @Security('Bearer', ['advanced-ingredients'])
    @Put('/delete/unit')
    public async DeleteCustomUnit(@Body() body: DeleteCustomUnitRequest): Promise<boolean> {
        try {
            await Services.IngredientTypeService.DeleteCustomUnit(body.ingredientTypeId, body.unitToDeleteId, body.descendent);
            return true;
        } catch (error) {
            if (error.name == 'NOT_EXIST') {
                console.error(error);
                this.setStatus(404);
                return false;
            } else {
                console.error(error);
                this.setStatus(500);
                return false;
            }
        }
    }

}
