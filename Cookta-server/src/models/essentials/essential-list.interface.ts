import {IIngredient} from "cookta-shared/dist/models/ingredient/ingredient.interface";


export interface IEssentialSection {
    FamilyId: string;
    Essentials: IIngredient[];
}
