import {EUnitType} from "../enums/unit-type.enum";

export interface iUnit {
    type: EUnitType,
    name: string,
    shortname: string,
    tobase: number,
    id: string

}
