import {IIngredient} from "cookta-shared/src/models/ingredient/ingredient.interface";


export interface IEssentialSection {
    FamilyId: string;
    Essentials: IIngredient[];
}
