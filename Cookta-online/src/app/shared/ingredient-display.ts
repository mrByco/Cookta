import {IIngredient} from './models/grocery/ingredient.interface';
import {IngredientService} from './services/ingredient-service/ingredient.service';
import {UnitService} from './services/unit-service/unit.service';
import {IngredientType} from './models/grocery/ingredient-type.model';
import {Unit} from './models/unit.interface';

export class DisplayIngredient {
  constructor(
    public ingredientSource: IIngredient,
    private ingredientService: IngredientService,
    private unitService: UnitService) {
    this.ingredientService.GetIngredientAsync(this.ingredientSource.ingredientID).then(type => {
      this.type = type;
      this.unitService.GetUnitAsync(this.ingredientSource.unit, type).then(unit => this.unit = unit);
    });
  }

  public get TypeName(): string {
    return this.type ? this.type.name : this.ingredientSource.ingredientID;
  }

  public get UnitName(): string {
    return this.unit ? this.unit.name : "MértékID";
  }

  public get Value(): string {
    return this.ingredientSource.value.toString();
  }

  public set Value(value) {
    if (!isNaN(+value))
      this.ingredientSource.value = +value;
    else
      this.Value = this.ingredientSource.value.toString();
  }

  public get ShortUnitNameSafe(): string {
    if (!this.unit)
      return this.UnitName;
    if (!this.unit.shortname)
      return this.UnitName;
    if (this.unit.shortname == "")
      return this.UnitName;
    return this.unit.shortname;
  }

  private type: IngredientType;
  private unit: Unit;
}
