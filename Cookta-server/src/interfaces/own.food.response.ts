import {iIngredient} from "./iingredient";

export interface OwnFoodResponse {
    owner: string,
    name: string,
    desc: string,
    isPrivate: boolean,
    published: boolean,
    ingredients: iIngredient[],
    imageUploaded: number,
    uploaded: number,
    dose: number,
    tags: string[],
    lastModified: number,
    generated: any,
    subscriptions: number,
    foodId: string
}
