
import {StoreItemBase} from 'atomik/lib/store-item/store-item-base';
import {EUnitType} from "cookta-shared/dist/models/unit/unit-type.enum";
import {ICompleteIngredient} from "cookta-shared/dist/models/ingredient/ingredient.interface";
import {IUnit} from "cookta-shared/dist/models/unit/unit.interface";

export class Unit extends StoreItemBase implements IUnit {

    public type: EUnitType = null;
    public name: string = null;
    public shortname: string = null;
    public tobase: number = null;
    public id: string = null;


    public static GetCommonBaseUnit(ing1: ICompleteIngredient, ing2: ICompleteIngredient) {
        if (ing1.unit.type != ing2.unit.type) {
            throw Error('You want to find the base type of two different unit.');
        }
        return this.GetBaseUnitOf(ing1.unit.type);
    }

    public static GetBaseUnitOf(type: EUnitType) {
        switch (type) {
            case EUnitType.MASS:
                return {name: 'g', type: EUnitType.MASS, id: 'g', shortname: 'g', tobase: 1};
            case EUnitType.COUNT:
                return {name: 'db', type: EUnitType.COUNT, id: 'db', shortname: 'db', tobase: 1};
            case EUnitType.VOLUME:
                return {name: 'l', type: EUnitType.VOLUME, id: 'l', shortname: 'l', tobase: 1};
        }
    }

}
