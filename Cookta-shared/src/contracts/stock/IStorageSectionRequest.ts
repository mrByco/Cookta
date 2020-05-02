
import { ObjectId } from "mongodb";
import { IIngredient } from "../../models/ingredient/ingredient.interface";

export interface IStorageSectionRequest {

    Id?: ObjectId;
    FamilyId?: string;
    Name?: string;
    Items?: IIngredient[];
    IsDefaultList?: boolean;
}


