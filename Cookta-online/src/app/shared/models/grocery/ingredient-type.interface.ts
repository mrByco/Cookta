import {Unit} from "../unit.interface";

export interface IngredientType {
  category: string,
  name: string,
  baseUnit: string,
  volumeEnabled: boolean,
  CuntEnabled: boolean,
  massEnabled: boolean,
  inshopping: string,
  guid: string,
  options: {
    cunits: Unit[],
  }
}
