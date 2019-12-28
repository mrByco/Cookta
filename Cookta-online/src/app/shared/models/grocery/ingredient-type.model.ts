import {Unit} from "../unit.interface";
import {IDisplayable} from "../../../utilities/displayable";
import {IngredientAdderComponent} from "../../../food/food-assemblies/ingredient-adder/ingredient-adder.component";

export class IngredientType implements IDisplayable {


  constructor (
    public category: string,
    public name: string,
    public baseUnit: string,
    public volumeEnabled: boolean,
    public CountEnabled: boolean,
    public massEnabled: boolean,
    public inshopping: string,
    public guid: string,
    public options: {
      cunits: Unit[],
    }) {

  }


  public displayName(): string {
    return name;
  }

  public static FromJson(data: any): IngredientType {
    let ingredientType = new IngredientType(
      data['category'],
      data['name'],
      data['baseUnit'],
      data['volumeEnabled'],
      data['countEnabled'],
      data['massEnabled'],
      data['inshopping'],
      data['guid'],
      data['options']
    );
    ingredientType.displayName = () => {return ingredientType.name}
    return ingredientType;
  }
  public ToJson() {
    return new Error("Not implemented")
  }
}
