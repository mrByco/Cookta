import {IIngredient} from "cookta-shared/src/models/ingredient/ingredient.interface";


export interface IStorageItemChangeRequest {
    Id: string,
    Name?: string,
    Items?: IIngredient[],
    GeneralList?: IIngredient[],
    IsDefaultList?: boolean
}
