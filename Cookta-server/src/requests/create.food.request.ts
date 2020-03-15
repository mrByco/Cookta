import {IIngredient} from "../interfaces/IIngredient";
import {ObjectID} from "bson";

export interface IUpdateFoodRequest {

    name: string,
    desc: string,
    isPrivate: boolean,
    published: boolean,
    ingredients: IIngredient[],
    dose: number,
    tags: string[],
    foodId?: string
}
