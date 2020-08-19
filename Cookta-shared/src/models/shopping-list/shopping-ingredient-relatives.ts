import {IIngredient} from "../ingredient/ingredient.interface";

export interface IIngredientRelatives {
    SectionItems: {sectionId: string, ingredient: IIngredient}[];
    MenuItems: {day: string, food: string, dose: number, ingredient: IIngredient}[];
    EssentialItems: {ingredient: IIngredient}[];
}
