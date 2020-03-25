import {EUnitType} from "./grocery/unit-type.enum";

export interface Unit {
  type: EUnitType,
  name: string,
  shortname: string,
  tobase: number,
  id: string
}
