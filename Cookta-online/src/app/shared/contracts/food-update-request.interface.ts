import {IIngredient} from "../models/grocery/ingredient.interface";

export interface IFoodUpdateRequest {
  name: string,
  desc: string,
  isPrivate: boolean,
  published: boolean,
  ingredients: IIngredient[],
  dose: number,
  tags: string[],
  foodId?: string
}
