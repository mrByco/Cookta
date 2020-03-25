import {IngredientType} from '../models/grocery/ingredient-type.model';
import {Food} from "../models/grocery/food.model";
import {Routes} from "../routes";
import {ServerService} from "./server.service";
import {EventEmitter, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {delay} from "rxjs/operators";
import {DisplayIngredient} from "../ingredient-display";

@Injectable()
export class IngredientService {

  public OnIngredientsChanged: EventEmitter<IngredientType[]> = new EventEmitter<IngredientType[]>();
  public IngredientTypes: Promise<IngredientType[]>;
  public LastLoadedTypes: IngredientType[] = [];

  public get Categories(): string[]{
    let categories = [];
    for (let type of this.LastLoadedTypes){
       if (!categories.includes(type.category)){
         categories.push(type.category);
       }
    }
    return categories;
  };

  constructor(
    private serverService: ServerService,
    private http: HttpClient
  ) {
    this.IngredientTypes = this.LoadIngredients();
  }

  public async LoadIngredients(): Promise<IngredientType[]>{

    return new Promise(async resolve => {

      let response = await this.http.get(this.serverService.GetBase() + Routes.IngredientType.GetAll);

      let types: IngredientType[] = [];
      response.subscribe(data => {
        for (const d of (data as any)){
          types.push(IngredientType.FromJson(d));
        }
        this.LastLoadedTypes = types;
        resolve(types);
      }, error => {
        resolve([]);
      });
    });
  }

  public async GetIngredientAsync(id: string): Promise<IngredientType>{
    let types = await this.IngredientTypes;

    return types.find(type => type.guid == id);
  }
  public GetIngredient(id: string): IngredientType{
    let types = this.LastLoadedTypes;

    return types.find(type => type.guid == id);
  }

  public async SaveIngredient(type: IngredientType): Promise<IngredientType>{
    let response = await this.serverService.PostRequest(Routes.IngredientType.SaveIngredient, type.ToJson());

    return new Promise<IngredientType>(resolve => {

      let types: IngredientType[] = [];
      response.subscribe(data => {
        let all = data['all'] as any;
        for (const d of all){
          types.push(IngredientType.FromJson(d));
        }
        this.LastLoadedTypes = types;
        this.IngredientTypes = new Promise<IngredientType[]>(r => r(types));
        this.OnIngredientsChanged.emit(types);
        resolve(IngredientType.FromJson(data['created']));
      }, error => {
        resolve(null);
      });
    })

  }

  public static IsValidIngredientName(name: string): string | undefined{
    if (name.length < 2)
      return "Minimum 2 character";
    if (name.length > 35)
      return "Max 35 character";
  }
  public static IsValidCategoryName(name: string): string | undefined{
    if (name.length < 2)
      return "Minimum 2 character";
    if (name.length > 35)
      return "Max 35 character";
  }

}
