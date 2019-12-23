import {Injectable} from "@angular/core";
import {IdentityService} from "./identity.service";
import {HttpClient} from "@angular/common/http";
import {ServerService} from "../models/grocery/server.service";
import {Routes} from "../routes";
import {Food} from "../models/grocery/food.model";

@Injectable()
export class FoodService {

  constructor(
    private serverService: ServerService,
    private identityService: IdentityService,
    private http: HttpClient) {

  }
  public async GetFoods(): Promise<Food[]>{
    let response = await this.http.get(this.serverService.GetBase() + Routes.Food.GetFood);

    return new Promise((resolve, reject) => {
      let foods: Food[] = [];
      response.subscribe(data => {
        for (const d of (data as any)){
          foods.push(Food.FromJson(d));
        }
      }, error => {
        foods = [];
      });
      resolve(foods);
    })
  }
  public async GetFood(id: string): Promise<Food> {
    let response = await this.http.get(this.serverService.GetBase() + Routes.Food.GetFoodId.replace('{id}', id));
    return new Promise((resolve) => {
      response.subscribe(data => {
        resolve(Food.FromJson(data));
      }, error => {
        return null;
      });
    });
  }

}
