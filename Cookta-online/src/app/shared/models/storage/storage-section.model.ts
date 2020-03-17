import {IIngredient} from '../grocery/ingredient.interface';


export interface IStorageItemChangeRequest {
  Id: string,
  Name?: string,
  Items?: IIngredient[],
  GeneralList?: IIngredient[],
  IsDefaultList?: boolean
}


export class StorageSection {
  public Id: string;
  public Name: string;
  public FamilyId: string;
  public Items: IIngredient[];
  public GeneralList: IIngredient[];
  public IsDefaultList: boolean;
}
