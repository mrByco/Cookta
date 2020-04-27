import {IEssentialSection} from "../models/essentials/essential-list.interface";
import {IStorageSection} from "./IStorageSectionRequest";
import {Food} from "../models/food/food.model";

export interface IIngredientDependendentObject {
    essentials: IEssentialSection[],
    storages: IStorageSection[],
    foods: Food[]
}
