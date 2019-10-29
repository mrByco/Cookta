import {iIngredient} from "../interfaces/iingredient";
import {ObjectID} from "bson";

export interface IUpdateFoodRequest {

    name: string,
    desc: string,
    isPrivate: boolean,
    published: boolean,
    ingredients: iIngredient[],
    dose: number,
    tags: string[],
    foodId?: string
}
