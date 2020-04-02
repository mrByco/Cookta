import {EUnitType} from './unit-type.enum';
import {Unit} from '../unit.interface';

export interface IIngredientType {

  category: string,
  name: string,
  baseUnit: string,
  baseUnitType: EUnitType,
  inshopping: string,
  guid: string,
  options: {
    cunits: Unit[],
  };
}
