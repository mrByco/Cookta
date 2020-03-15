import {IIngredient} from "./IIngredient";
import { ObjectId } from "mongodb";

export interface IStorageSection {

    Id?: ObjectId;
    FamilyId?: string;
    Name?: string;
    Items?: IIngredient[];
    GeneralList?: IIngredient[];
    IsDefaultList?: boolean;
}
