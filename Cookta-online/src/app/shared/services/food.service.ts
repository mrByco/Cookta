import {Injectable} from "@angular/core";
import {IdentityService} from "./identity.service";
import {HttpClient} from "@angular/common/http";
import {ServerService} from "./server.service";
import {Routes} from "../routes";
import {Food} from "../models/grocery/food.model";
import {IFoodUpdateRequest} from "../contracts/food-update-request.interface";

@Injectable()
export class FoodService {
  public static Placeholder: Food = new Food("", '', '', true, false, [], 0, 0, 0, 0, 0, null, null, [], [], false, false);

  constructor(
    private serverService: ServerService,
    private identityService: IdentityService,
    private http: HttpClient) {

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
    if (file) {
      let a = await this.serverService.PostRequest(Routes.Food.PostFoodImage.replace('{foodVersionId}', food.id), file, true);
      await new Promise((resolve) => {
        a.subscribe(data => {
          resolve();
        });
      });
    }
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
    return new Promise((resolve) => {
      response.subscribe(data => {
        resolve(Food.FromJson(data));
      }, () => {
        return null;
      });
    });
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
