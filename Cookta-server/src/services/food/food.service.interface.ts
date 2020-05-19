import {Food} from '../../models/food/food.model';
import {IUpdateFoodRequest} from "cookta-shared/src/contracts/foods/update-food.request";
import {Family} from "../../models/family.model";

export interface IFoodService {
    GetAllFoods(filter: any): Food[]

    GetAllPublicFoods(): Food[]

    GetAllOwnFoods(userSub: string)

    GetFoodForUser(foodId: string, userSub: string): Food,

    GetIncremental(start: number, count: number, filter?: any): Promise<Food[]>

    FoodSearch(text: string, count: number): Promise<Food[]>


    GetFood(foodId?: string, versionId?: string): Food

    UpdateFood(request: IUpdateFoodRequest, changerSub: string)

    Delete(id: string, deleterSub: string)

    SaveFood(food: Food, generate?: boolean)


    UploadImage(foodVersionName: string, path: string, userSub: string)

    DeleteImage(foodVersionId: string, userSub: string): Promise<boolean>

    FilterByTags(foods: Food[], tagId: string): Food[]

    GetCollectionForUser(userSub: string, currentFamily: Family): Promise<Food[]>
}
