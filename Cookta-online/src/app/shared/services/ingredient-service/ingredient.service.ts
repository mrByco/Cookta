import {IngredientType} from '../../models/grocery/ingredient-type.model';
import {Routes} from '../../routes';
import {ServerService} from '../server.service';
import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Unit} from '../../models/unit.interface';
import {CheckUnitRefResponse} from '../../../../../../Cookta-shared/src/contracts/ingredient-type/check-ingredient.contrats';
import {DeleteCustomUnitRequest} from '../../../../../../Cookta-shared/src/contracts/ingredient-type/delete-custom-unit';
import {
  IDeleteIngredientTypeRequest,
  IDeleteIngredientTypeResponse
} from '../../../../../../Cookta-shared/src/contracts/ingredient-type/delete-ingredient-type';

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
  }

  public async LoadIngredients(): Promise<IngredientType[]>{

    this.IngredientTypes = new Promise<IngredientType[]>(async resolve => {

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
    return this.IngredientTypes;
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
        console.log( types.length + ' ingredients loaded')
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

  public GetLastLoadedCustomUnitsFor(): string[] {
    let names: string[] = [];
    for (let ing of this.LastLoadedTypes){
      if (!ing.options || !ing.options.cunits || ing.options.cunits.length == 0)
        continue;
      for (let unit of ing.options.cunits){
        if  (!names.includes(unit.name.toLowerCase())){
          names.push(unit.name);
        }
        if (unit.shortname && unit.shortname != '' && !names.includes(unit.shortname.toLowerCase())){
          names.push(unit.shortname);
        }
      }
    }
    return names;
  }

  //Return response on Ok, on error returns null
  public async GetUsageOfCustomUnit(unit: Unit): Promise<CheckUnitRefResponse> {
    let response = await this.serverService.GetRequest(Routes.IngredientType.CheckUnit.replace('{unitId}', unit.id));
    return new Promise(resolve => {
      response.subscribe(s => {
        resolve(s);
      }, error => {
        console.error('Cannot get references of unit.');
        console.error(error);
        resolve(null);
      });
    });
  }

  //return on process is done
  public async DeleteCustomUnit(currentType: IngredientType, currentUnit: Unit, descendentId?: string): Promise<void> {
    let body: DeleteCustomUnitRequest = {ingredientTypeId: currentType.guid, unitToDeleteId: currentUnit.id, descendent: descendentId};
    let response = await this.serverService.PutRequest(Routes.IngredientType.DeleteCustomUnit, body);

    return new Promise(resolve => {
      response.subscribe(s => {
        this.LoadIngredients().then(() => resolve());
      }, error => {
        console.error('Cannot delete unit.');
        console.error(error);
        resolve();
      });
    });
  }


  public async DeleteIngredientType(request: IDeleteIngredientTypeRequest): Promise<IDeleteIngredientTypeResponse>{
    let response = await this.serverService.PutRequest(Routes.IngredientType.DeleteIngredientType, request)

    return new Promise(resolve => {
      response.subscribe(s => {
        let resp = s as IDeleteIngredientTypeResponse;
        if (resp.success)
          location.reload();
        resolve(s);
      }, error => {
        console.error('Cannot delete unit.');
        console.error(error);
        resolve();
      });
    });
  }
}
