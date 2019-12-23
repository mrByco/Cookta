import {IngredientType} from '../models/grocery/ingredient-type.interface';
import {Food} from "../models/grocery/food.model";
import {Routes} from "../routes";
import {ServerService} from "../models/grocery/server.service";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {delay} from "rxjs/operators";

@Injectable()
export class IngredientService {
  public IngredientTypes: Promise<IngredientType[]>;

  constructor(
    private serverService: ServerService,
    private http: HttpClient
  ) {
    this.IngredientTypes = this.LoadIngredients();
  }

  public async LoadIngredients(): Promise<IngredientType[]>{

    return new Promise(async resolve => {

      let response = await this.http.get(this.serverService.GetBase() + Routes.IngredientType.GetAll);
      await new Promise(resolve =>
        setTimeout(resolve, 500)
      );

      let types: IngredientType[] = [];
      response.subscribe(data => {
        for (const d of (data as any)){
          types.push(d);
        }
        resolve(types);
      }, error => {
        resolve([]);
      });
    });
  }

  public async GetIngredient(id: string): Promise<IngredientType>{
    let types = await this.IngredientTypes;

    return types.find(type => type.guid == id);
  }

}
