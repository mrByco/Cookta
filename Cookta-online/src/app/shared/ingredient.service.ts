import {IngredientType} from '../../models/grocery/ingredient-type.interface';

export class IngredientService {
  public IngredientTypes: Promise<IngredientType[]>;

  constructor() {
    this.IngredientTypes = this.LoadIngredients();
  }

  public async LoadIngredients(): Promise<IngredientType[]>{
    //TODO HTTP CALL
    //PLACEHOLDER DELAY
    await new Promise(resolve =>
      setTimeout(resolve, 5000)
    );

    let responseData: any = {};
    let types: IngredientType[] = [];
    for await (let data of responseData as AsyncIterable<string>){
      let ingredient = JSON.parse(data) as IngredientType;
      types.push(ingredient);
    }
    return types;
  }

  public async GetIngredient(id: string): Promise<IngredientType>{
    return (await this.IngredientTypes).find(type => type.guid);
  }

}
