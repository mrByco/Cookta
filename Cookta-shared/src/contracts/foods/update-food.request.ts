import {IIngredient} from "../../models/ingredient/ingredient.interface";


export interface IUpdateFoodRequest {
    name: string,
    desc: string,
    private: boolean,
    ingredients: IIngredient[],
    dose: number,
    tags: string[],
    foodId?: string
}
