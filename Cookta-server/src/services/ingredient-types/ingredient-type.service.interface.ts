import {IStoreService} from 'atomik/lib/store-service/store-service-interface';
import {IngredientType} from '../../models/ingredient-type/ingredient-type.model';
import {IIngredientType} from "cookta-shared/src/models/ingredient-type/ingredient-type.interface";
import {IIngredientDependendentObject} from "../../interfaces/ingredient-dependency-object.interface";
import { ISetIngredientTypeRequest } from 'cookta-shared/src/contracts/ingredient-type/set.ingredient-type.request';

export interface IIngredientTypeService extends IStoreService<IIngredientType> {
    GetAllNotArhived(): IIngredientType[];

    SetIngredientType(request: ISetIngredientTypeRequest): IngredientType;

    DeleteIngredientType(guid: string, forced: boolean, descendent: string, ingredientDependencies: IIngredientDependendentObject): Promise<boolean>;

    GetIngredientReferenceCount(id: string, ingredientDependencies: IIngredientDependendentObject): Promise<number>;

    CheckUnitReferences(unitId: string): Promise<{ foods: number, essentials: number, storage: number }>;

    DeleteCustomUnit(ingredientId: string, unitId: string, descendentId?: string): Promise<void>;
}
