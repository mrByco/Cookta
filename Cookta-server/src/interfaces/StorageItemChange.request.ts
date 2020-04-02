import {ObjectId} from "mongodb";
import {IIngredient} from "./IIngredient";

export interface IStorageItemChangeRequest {
    Id: string,
    Name?: string,
    Items?: IIngredient[],
    GeneralList?: IIngredient[],
    IsDefaultList?: boolean
}
