import {IUnit} from "../../../../Cookta-shared/src/models/unit/unit.interface";


export interface IIngredientType {
    category: string;
    name: string;
    volumeEnabled: boolean;
    countEnabled: boolean;
    massEnabled: boolean;
    guid: string;
    options: {cunits: IUnit[]};
    arhived?: boolean;
}
