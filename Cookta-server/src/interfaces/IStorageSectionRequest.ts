import {IIngredient} from "./IIngredient";
import { ObjectId } from "mongodb";

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
