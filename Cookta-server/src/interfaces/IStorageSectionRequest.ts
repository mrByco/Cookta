
import { ObjectId } from "mongodb";
import {IIngredient} from "cookta-shared/dist/models/ingredient/ingredient.interface";

export interface IStorageSectionRequest {

    Id?: ObjectId;
    FamilyId?: string;
    Name?: string;
    Items?: IIngredient[];
    IsDefaultList?: boolean;
}


export interface IStorageSection {

    Id: ObjectId;
    FamilyId: string;
    Name: string;
    Items: IIngredient[];
    IsDefaultList: boolean;
}
