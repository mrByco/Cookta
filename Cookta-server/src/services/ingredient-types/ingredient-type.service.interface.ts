import {IStoreService} from 'atomik/lib/store-service/store-service-interface';
import {ISetIngredientTypeRequest} from '../../requests/set.ingredient-type.request';
import {IngredientType} from '../../models/ingredient-type/ingredient-type.model';
import {IIngredientType} from "cookta-shared/dist/models/ingredient-type/ingredient-type.interface";
import {IIngredientDependencyObject} from "../../interfaces/ingredient-dependency-object.interface";

export interface IIngredientTypeService extends IStoreService<IIngredientType> {
    GetAllNotArhived(): IIngredientType[];

    SetIngredientType(request: ISetIngredientTypeRequest): IngredientType;

    DeleteIngredientType(guid: string, forced: boolean, descendent: string, ingredientDependencies: IIngredientDependencyObject): boolean;

    GetIngredientReferenceCount(id: string, ingredientDependencies: IIngredientDependencyObject): Promise<number>;

    CheckUnitReferences(unitId: string): Promise<{ foods: number, essentials: number, storage: number }>;

    DeleteCustomUnit(ingredientId: string, unitId: string, descendentId?: string): Promise<void>;
}
