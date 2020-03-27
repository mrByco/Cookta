import {Body, Controller, Delete, Get, Post, Route, Security, Tags} from "tsoa";
import {IngredientType} from "../models/IngredientType/ingredient-type.model";
import {ISetIngredientTypeRequest} from "../requests/set.ingredient-type.request";

@Route('/ingredientType')
@Tags('IngredientType')
export class IngredientTypeController extends Controller {
    @Get()
    public async GetAll(): Promise<IngredientType[]> {
        try{
            return await IngredientType.GetAllTypes();
        }catch{
            this.setStatus(500);
        }
    }
    @Security('Bearer', ['edit-ingredients'])
    @Post()
    public async SetIngredient(@Body() request: ISetIngredientTypeRequest): Promise<{all: IngredientType[], created: IngredientType}> {
        let result = {all: undefined, created: undefined};
        result.created = await IngredientType.SetIngredientType(request);
        result.all = await this.GetAll();
        return result;
        try{
        }catch{
            this.setStatus(500);
        }
    }
    @Security('Bearer', ['delete-ingredients'])
    @Delete('/{guid}')
    public async DeleteIngredient(guid: string): Promise<IngredientType[]> {
        try{
            await IngredientType.DeleteIngredientType(guid);
            return await IngredientType.GetAllTypes();
        }catch{
            this.setStatus(500);
        }
    }
}
