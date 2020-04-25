import {IUnit} from "../../../Cookta-shared/src/models/unit/unit.interface";


export interface ISetIngredientTypeRequest {
    category: string,
    name: string,
    guid?: string,
    volumeEnabled: boolean,
    countEnabled: boolean,
    massEnabled: boolean,
    options: {cunits: IUnit[]}
}
