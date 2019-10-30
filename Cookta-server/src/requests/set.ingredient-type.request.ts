import {iUnit} from "../interfaces/iunit";

export interface ISetIngredientTypeRequest {
    category: string,
    name: string,
    baseUnit: string,
    volumeEnabled: boolean,
    countEnabled: boolean,
    massEnabled: boolean,
    inshopping: string,
    options: {cunits: iUnit[]}
}
