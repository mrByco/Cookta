import {IIngredient} from '../grocery/ingredient.interface';
import {IngredientType} from '../grocery/ingredient-type.model';


export interface IStorageItemChangeRequest {
  Id: string,
  Name?: string,
  Items?: IIngredient[],
  GeneralList?: IIngredient[],
  IsDefaultList?: boolean
}


export class StorageSection {
  public Id: string = undefined;
  public Name: string = undefined;
  public FamilyId: string = undefined;
  public Items: IIngredient[] = [];
  public GeneralList: IIngredient[] = [];
  public IsDefaultList: boolean = false;

  public GetDisplayName() {
    return this.Name == undefined || this.Name == '' ? 'Névtelen' : this.Name
  }

  public filterItemsByIngId(type: IngredientType) {
    return this.Items.filter(i => i.ingredientID == type.guid);
  }
}
