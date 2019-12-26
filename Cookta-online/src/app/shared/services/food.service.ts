import {Injectable} from "@angular/core";
import {IdentityService} from "./identity.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ServerService} from "./server.service";
import {Routes} from "../routes";
import {Food} from "../models/grocery/food.model";

@Injectable()
export class FoodService {

  constructor(
    private serverService: ServerService,
    private identityService: IdentityService,
    private http: HttpClient) {

  }
  public GetFoods(): Promise<Food[]>{

    return new Promise(async (resolve, reject) => {
      let response = await this.serverService.GetRequest( Routes.Food.GetPublicFoods);
      let foods: Food[] = [];
      response.subscribe(data => {
        for (const d of (data as any)){
          foods.push(Food.FromJson(d));
        }
        resolve(foods);
      }, error => {
        resolve([]);
      });
    })
  }

  public GetCollection(): Promise<Food[]> {
    return new Promise(async (resolve, reject) => {
      let response = await this.serverService.GetRequest( Routes.Food.GetCollectionFoods);
      let foods: Food[] = [];
      response.subscribe(data => {
        for (const d of (data as any)){
          foods.push(Food.FromJson(d));
        }
        resolve(foods);
      }, error => {
        resolve([]);
      });
    })
  }
  public async GetFood(id: string): Promise<Food> {
    let response = await this.serverService.GetRequest(Routes.Food.GetFoodId.replace('{id}', id));
    return new Promise((resolve) => {
      response.subscribe(data => {
        resolve(Food.FromJson(data));
      }, error => {
        return null;
      });
    });
  }
}
