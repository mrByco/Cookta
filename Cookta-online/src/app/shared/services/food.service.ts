import {Injectable} from '@angular/core';
import {ServerService} from './server.service';
import {Routes} from '../routes';
import {Food} from '../models/grocery/food.model';
import {IUpdateFoodRequest} from '../../../../../Cookta-shared/src/contracts/foods/update-food.request';
import {ISendableFood} from '../../../../../Cookta-shared/src/models/food/food-sendable.interface';
import {IHomeRowContent} from '../../../../../Cookta-shared/src/models/home/home-row-content.interface';
import {IHomeContentRequest} from '../../../../../Cookta-shared/src/contracts/home/home-content.request';

@Injectable()
export class FoodService {
  public static Placeholder: Food = new Food('', '', '', true, false, [], 0, 0, 0, 0, 0, null, null, [], [], false, false);
  public static NoReferenceError: Food = new Food('NOREFERENCE', 'NOREFERENCE', 'NOREFERENCE', true, false, [], 0, 0, 0, 0, 0, null, null, [], [], false, false);
  public static EmptyTag: Food =
    new Food(undefined, 'ÜRES TAG', 'ÜRES TAG', true, false, [], 0, 0, 0, 0, 0, null, null, [], [], false, false);


  constructor(
    private serverService: ServerService) {

  }

  public GetFoods(): Promise<Food[]> {

    return new Promise(async (resolve) => {
      let response = await this.serverService.GetRequest(Routes.Food.GetPublicFoods);
      let foods: Food[] = [];
      response.subscribe(data => {
        for (const d of (data as any)) {
          foods.push(Food.FromJson(d));
        }
        resolve(foods);
      }, () => {
        resolve([]);
      });
    });
  }

  public GetCollection(): Promise<Food[]> {
    return new Promise(async (resolve) => {
      let response = await this.serverService.GetRequest(Routes.Food.GetCollectionFoods);
      let foods: Food[] = [];
      response.subscribe(data => {
        for (const d of (data as any)) {
          foods.push(Food.FromJson(d));
        }
        resolve(foods.reverse());
      }, () => {
        resolve([]);
      });
    });
  }

  public GetOwnFoods(): Promise<Food[]> {
    return new Promise(async (resolve) => {
      let response = await this.serverService.GetRequest(Routes.Food.GetOwnFoods);
      let foods: Food[] = [];
      response.subscribe(data => {
        for (const d of (data as any)) {
          foods.push(Food.FromJson(d));
        }
        resolve(foods.reverse());
      }, () => {
        resolve([]);
      });
    });
  }

  public GetFamilyFoods(): Promise<Food[]> {
    return new Promise(async (resolve) => {
      let response = await this.serverService.GetRequest(Routes.Food.GetFamilyFoods);
      let foods: Food[] = [];
      response.subscribe(data => {
        for (const d of (data as any)) {
          foods.push(Food.FromJson(d));
        }
        resolve(foods.reverse());
      }, () => {
        resolve([]);
      });
    });
  }

  public GetSubscriptionFoods(): Promise<Food[]> {
    return new Promise(async (resolve) => {
      let response = await this.serverService.GetRequest(Routes.Food.GetSubscriptionFoods);
      let foods: Food[] = [];
      response.subscribe(data => {
        for (const d of (data as any)) {
          foods.push(Food.FromJson(d));
        }
        resolve(foods.reverse());
      }, () => {
        resolve([]);
      });
    });
  }

  public async GetFood(id: string): Promise<Food> {
    let response = await this.serverService.GetRequest(Routes.Food.GetFoodById.replace('{id}', id));

    return new Promise((resolve) => {
      response.subscribe(d => {
        resolve(Food.FromJson(d));
      }, () => {
        return null;
      });
    });
  }

  public async GetFoodPage(id: string, count: number): Promise<{ food: Food, recommendations: Food[] }> {
    let response = await this.serverService.GetRequest(Routes.Food.GetFoodPageById.replace('{id}', id).replace('{count}', count.toString()));

    return new Promise((resolve) => {
      response.subscribe(d => {
        let data = d as { food: ISendableFood, recommendations: ISendableFood[] };
        resolve(
          {
            food: Food.FromJson(data.food),
            recommendations: data.recommendations.map(m => Food.FromJson(m))
          });
      }, () => {
        return null;
      });
    });
  }

  public async DeleteFood(id: string): Promise<void> {
    let response = await this.serverService.DeleteRequest(Routes.Food.DeleteFoodId.replace('{id}', id));
    return new Promise((resolve) => {
      response.subscribe(() => {
        resolve();
      }, () => {
        resolve();
      });
    });
  }

  public async UpdateFood(food: Food, file?: File): Promise<Food> {
    let body: IUpdateFoodRequest = {
      desc: food.desc,
      foodId: food.foodId,
      ingredients: food.ingredients,
      private: food.isPrivate,
      dose: food.dose,
      name: food.name,
      tags: food.tags.map(value => value.guid),
    };
    let response = await this.serverService.PostRequest(Routes.Food.PostFood, body);
    let newFood: Food = await new Promise((resolve) => {
      response.subscribe(data => {
        resolve(Food.FromJson(data));
      }, () => {
        return null;
      });
    });
    if (file) {
      let a = await this.serverService.PostRequest(Routes.Food.PostFoodImage.replace('{foodVersionId}', newFood.id), file, true);
      await new Promise((resolve) => {
        a.subscribe(() => {
          resolve();
        });
      });
    }
    return newFood;
  }

  public async SetSubscription(foodId: string, state: boolean): Promise<void> {
    let response = await this.serverService.PutRequest(Routes.Food.SetSubscription, {foodId: foodId, state: state});
    return new Promise((resolve) => {
      response.subscribe(() => {
        resolve();
      }, () => {
        return null;
      });
    });
  }

  public async DeleteImage(foodVersionId: string) {
    let response = await this.serverService.DeleteRequest(Routes.Food.DeleteFoodImage.replace('{foodVersionId}', foodVersionId));
    return new Promise((resolve) => {
      response.subscribe(() => {
        resolve();
      }, (err) => {
        console.log(err);
        resolve();
      });
    });
  }

  public async GetHomeContent(requests: IHomeContentRequest[]): Promise<IHomeRowContent[]> {
    let rowContents: IHomeRowContent[] = [];
    for (let request of requests) {
      let foods = await this.GetFoods();
      rowContents.push({foods: foods.slice(0, request.count - 1), clickAction: 'open', title: 'Cimke legfrissebb ételei', other: null});
    }
    return rowContents;
  }
}
