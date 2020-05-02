import {IEssentialSection} from "../models/essentials/essential-list.interface";
import {Food} from "../models/food/food.model";
import { IStorageSection } from 'cookta-shared/src/models/storage-sections/storage-section.interface';

export interface IIngredientDependendentObject {
    essentials: IEssentialSection[],
    storages: IStorageSection[],
    foods: Food[]
}
