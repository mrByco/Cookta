import {Body, Controller, Delete, Get, Post, Route, Security, Tags} from "tsoa";
import {IngredientType} from "../models/ingredient-type/ingredient-type.model";
import {ISetIngredientTypeRequest} from "../requests/set.ingredient-type.request";
import {Services} from "../Services";
import {IIngredientType} from "../models/ingredient-type/ingredient-type.interface";
import {IIngredient} from "../interfaces/IIngredient";

@Route('/ingredientType')
@Tags('IngredientType')
export class IngredientTypeController extends Controller {
    @Get()
    public async GetAll(): Promise<IIngredientType[]> {
        try{
            return Services.IngredientTypeService.GetAllItems();
        }catch{
            this.setStatus(500);
        }
    }
    @Security('Bearer', ['edit-ingredients'])
    @Post()
    public async SetIngredient(@Body() request: ISetIngredientTypeRequest): Promise<{all: IIngredientType[], created: IIngredientType}> {
        let result = {all: undefined, created: undefined};
        result.created = Services.IngredientTypeService.SetIngredientType(request);
        result.all = await this.GetAll();
        return result;
        try{
        }catch{
            this.setStatus(500);
        }
    }
    @Security('Bearer', ['delete-ingredients'])
    @Delete('/{guid}')
    public async DeleteIngredient(guid: string): Promise<IIngredientType[]> {
        try{
            await Services.IngredientTypeService.DeleteIngredientType(guid);
            return Services.IngredientTypeService.GetAllItems();
        }catch{
            this.setStatus(500);
        }
    }
}
