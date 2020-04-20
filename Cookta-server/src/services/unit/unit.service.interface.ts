import {IStoreService} from 'atomik/lib/store-service/store-service-interface';
import {Unit} from '../../models/unit/unit.model';
import {IIngredientType} from '../../models/ingredient-type/ingredient-type.interface';
import {IUnit} from '../../models/unit/unit.interface';

export interface IUnitService extends IStoreService<Unit> {

    GetAvailableUnitsForType(type: IIngredientType): IUnit[];

}
