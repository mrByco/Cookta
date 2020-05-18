import {Food} from "../../models/food/food.model";
import {StoreService} from "atomik/lib/store-service/store-service";
import {IFoodService} from "./food.service.interface";
import {IUpdateFoodRequest} from 'cookta-shared/src/contracts/foods/update-food.request';

export class FoodService extends StoreService<Food> implements IFoodService {

    GetAllFoods(filter: any): Food[] {
        let filtered = this.GetAllItems().filter(item => {
            for (let key of Object.keys(filter)) {
                if (item[key] != filter[key]) return false;
            }
            return true;
        });
        return filtered;
    }

    GetAllPublicFoods(): Food[] {
        return this.GetAllFoods({published: true, private: false});
    }

    GetAllOwnFoods(userSub: string) {
        return this.GetAllFoods({owner: userSub});
    }

    //TODO All not implemented
    Delete(id: string, deleterSub: string) {
    }

    DeleteImage(foodVersionId: string, userSub: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    FoodSearch(test: string, cound: number): Promise<Food[]> {
        return Promise.resolve([]);
    }


    GetCollectionForUser(userSub: string): Promise<Food[]> {
        return Promise.resolve([]);
    }

    GetFood(foodId?: string, versionId?: string): Promise<Food> {
        return Promise.resolve(undefined);
    }

    GetFoodForUser(foodId: string, userSub: string): Promise<Food> {
        return Promise.resolve(undefined);
    }

    GetFoodsOfTag(userSub: string, tagId: string): Promise<Food[]> {
        return Promise.resolve([]);
    }

    GetIncremental(start: number, count: number, filter?: any) {
    }


    UpdateFood(request: IUpdateFoodRequest, changerSub: string) {
    }

    UploadImage(foodVersionName: string, path: string, userSub: string) {
    }


}
