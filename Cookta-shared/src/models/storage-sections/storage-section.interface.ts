import {IIngredient} from "../ingredient/ingredient.interface";
import { ObjectId } from "mongodb";

export interface IStorageSection {

    Id: ObjectId;
    FamilyId: string;
    Name: string;
    Items: IIngredient[];
    IsDefaultList: boolean;
}
