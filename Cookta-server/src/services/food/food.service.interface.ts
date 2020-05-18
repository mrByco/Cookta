import {Food} from '../../models/food/food.model';
import {IUpdateFoodRequest} from "cookta-shared/src/contracts/foods/update-food.request";
import {ISendableFood} from "cookta-shared/src/models/food/food-sendable.interface";

export interface IFoodService {
    GetAllFoods(filter: any): Food[];

    GetAllPublicFoods(): Food[];

    GetAllOwnFoods(userSub: string);

    GetFoodForUser(foodId: string, userSub: string): Food,

    GetIncremental(start: number, count: number, filter?: any);

    FoodSearch(test: string, cound: number): Promise<Food[]>


    GetFood(foodId?: string, versionId?: string): Promise<Food>

    UpdateFood(request: IUpdateFoodRequest, changerSub: string)

    Delete(id: string, deleterSub: string)


    UploadImage(foodVersionName: string, path: string, userSub: string)

    DeleteImage(foodVersionId: string, userSub: string): Promise<boolean>

    GetFoodsOfTag(userSub: string, tagId: string): Promise<Food[]>

    GetCollectionForUser(userSub: string): Promise<Food[]>
}
