import {EUnitType} from './unit-type.enum';
import {Unit} from '../unit.interface';

export interface IIngredientType {

  category: string,
  name: string,
  baseUnitType: EUnitType,
  guid: string,
  nutrientCode?: number;
  options: {
    cunits: Unit[],
  };
}
