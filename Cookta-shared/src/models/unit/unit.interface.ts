import {EUnitType} from "./unit-type.enum";

export interface IUnit {
    type: EUnitType,
    name: string,
    shortname?: string,
    tobase: number,
    id: string

}
