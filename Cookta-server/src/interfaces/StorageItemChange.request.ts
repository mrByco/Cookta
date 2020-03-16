import {ObjectId} from "mongodb";
import {IIngredient} from "./IIngredient";

export interface IStorageItemChangeRequest {
    sectionId: string,
    name?: string,
    foods?: IIngredient[],
    general?: IIngredient[],
    isBase?: boolean
}
