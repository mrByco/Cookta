import {iUnit} from "../interfaces/iunit";

export interface ISetIngredientTypeRequest {
    category: string,
    name: string,
    guid?: string,
    volumeEnabled: boolean,
    countEnabled: boolean,
    massEnabled: boolean,
    options: {cunits: iUnit[]}
}
