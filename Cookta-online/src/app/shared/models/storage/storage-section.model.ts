import {IIngredient} from '../grocery/ingredient.interface';

export class StorageSection {
  public Id: string;
  public SectionName: string;
  public SectionItems: IIngredient[];
}
