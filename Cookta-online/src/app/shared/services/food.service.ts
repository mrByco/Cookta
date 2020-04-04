import {Injectable} from "@angular/core";
import {ServerService} from "./server.service";
import {Routes} from "../routes";
import {Food} from "../models/grocery/food.model";
import {IFoodUpdateRequest} from "../contracts/food-update-request.interface";

@Injectable()
export class FoodService {
  public static Placeholder: Food = new Food("", '', '', true, false, [], 0, 0, 0, 0, 0, null, null, [], [], false, false);
  public static NoReferenceError: Food = new Food("NOREFERENCE", 'NOREFERENCE', 'NOREFERENCE', true, false, [], 0, 0, 0, 0, 0, null, null, [], [], false, false);
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
    })
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
    })
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
    })
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
    })
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
    })
  }

  public async GetFood(id: string): Promise<Food> {
    let response = await this.serverService.GetRequest(Routes.Food.GetFoodId.replace('{id}', id));

    return new Promise((resolve) => {
      response.subscribe(data => {
        resolve(Food.FromJson(data));
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
    let body: IFoodUpdateRequest = {
      desc: food.desc,
      foodId: food.foodId,
      ingredients: food.ingredients,
      isPrivate: food.isPrivate,
      dose: food.dose,
      name: food.name,
      published: food.published,
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
        a.subscribe(data => {
          resolve();
        });
      });
    }
    return newFood;
  }

  public async SetSubscription(foodId: string, state: boolean): Promise<void> {
    let response = await this.serverService.PutRequest(Routes.Food.SetSubscription, {foodId: foodId, state: state});
    return new Promise((resolve) => {
      response.subscribe(data => {
        resolve();
      }, () => {
        return null;
      });
    });
  }
}
