import {Unit} from "../unit.interface";
import {IDisplayable} from "../../../utilities/displayable";
import {EUnitType} from "./unit-type.enum";

export class IngredientType implements IDisplayable {


  constructor (
    public category: string,
    public name: string,
    public baseUnit: string,
    public baseUnitType: EUnitType,
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
      this.boolUnitTypeToEnum(data['volumeEnabled'], data['countEnabled'], data['massEnabled']),
      data['inshopping'],
      data['guid'],
      data['options']
    );
    ingredientType.displayName = () => {return ingredientType.name}
    return ingredientType;
  }
  public ToJson() {
    console.log(this);
    return {
      category: this.category,
      name: this.name,
      baseUnit: this.baseUnit,
      volumeEnabled: IngredientType.enumUnitTypeToBool(this.baseUnitType).volumeEnabled,
      countEnabled: IngredientType.enumUnitTypeToBool(this.baseUnitType).countEnabled,
      massEnabled: IngredientType.enumUnitTypeToBool(this.baseUnitType).massEnabled,
      inshopping: this.inshopping,
      guid: this.guid,
      options: this.options
    };
  }
  public static boolUnitTypeToEnum(volumeEnabled: boolean, countEnabled: boolean, massEnabled): EUnitType {
    if (volumeEnabled)
      return EUnitType.volume;
    if (countEnabled)
      return EUnitType.count;
    if (massEnabled)
      return EUnitType.mass;
  }
  public static enumUnitTypeToBool(type: EUnitType): {volumeEnabled: boolean, countEnabled: boolean, massEnabled} {
    let base = {volumeEnabled: false, countEnabled: false, massEnabled: false};
    switch (type) {
      case EUnitType.count:
        base.countEnabled = true;
        break;
      case EUnitType.mass:
        base.massEnabled = true;
        break;
      case EUnitType.volume:
        base.volumeEnabled = true;
        break;
    }
    return base;
  }
}
