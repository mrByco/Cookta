import {StoreService} from 'atomik/lib/store-service/store-service';
import {IUnitService} from './unit.service.interface';
import {Unit} from '../../models/unit/unit.model';
import {IIngredientType} from '../../models/ingredient-type/ingredient-type.interface';
import {EUnitType} from '../../enums/unit-type.enum';
import {IUnit} from '../../models/unit/unit.interface';

export class UnitService extends StoreService<Unit> implements IUnitService {
    GetAvailableUnitsForType(type: IIngredientType): IUnit[] {
        return this.Items.filter(u => {
            switch (u.type) {
                case EUnitType.VOLUME:
                    return type.volumeEnabled;
                case EUnitType.COUNT:
                    return type.countEnabled;
                case EUnitType.MASS:
                    return type.massEnabled;
            }
        }).map(u => u as IUnit).concat(...type.options.cunits);
    }

}
