import {iUnit} from "../interfaces/iunit";

export interface ISetIngredientTypeRequest {
    category: string,
    name: string,
    guid?: string,
    baseUnit: string,
    volumeEnabled: boolean,
    countEnabled: boolean,
    massEnabled: boolean,
    inshopping: string,
    options: {cunits: iUnit[]}
}
