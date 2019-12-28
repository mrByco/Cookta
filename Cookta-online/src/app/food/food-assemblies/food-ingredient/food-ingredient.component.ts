import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {IIngredient} from "../../../shared/models/grocery/ingredient.interface";
import {IngredientService} from "../../../shared/services/ingredient.service";
import {IngredientType} from "../../../shared/models/grocery/ingredient-type.model";
import {Unit} from "../../../shared/models/unit.interface";
import {UnitService} from "../../../shared/services/unit.service";

class DisplayIngredient {
  constructor(
    private ingredientSource: IIngredient,
    private ingredientService: IngredientService,
    private unitService: UnitService) {
    this.ingredientService.GetIngredient(this.ingredientSource.ingredientID).then(type => {
      this.type = type;
      this.unitService.GetUnit(this.ingredientSource.unit, type).then(unit => this.unit = unit);
    });
  }

  public get TypeName(): string {
    return this.type ? this.type.name : this.ingredientSource.ingredientID;
  }
  public get UnitName(): string {
    return this.unit ? this.unit.name : "MértékID";
  }
  public get ValueName(): string {
    return this.ingredientSource.value.toString();
  }

  private type: IngredientType;
  private unit: Unit;
}

@Component({
  selector: 'app-food-ingredient',
  templateUrl: './food-ingredient.component.html',
  styleUrls: ['./food-ingredient.component.css']
})
export class FoodIngredientComponent implements OnInit {

  @Input('ingredient') private ingredient: IIngredient;
  @Input('edit') private edit: boolean = false;
  @Input('OnDeleted') private OnDeleted: (ingredient: IIngredient) => void;

  private displayIngredient: DisplayIngredient;

  constructor(
    private ingredientService: IngredientService,
    private unitService: UnitService) {
  }

  ngOnInit() {
    this.displayIngredient = new DisplayIngredient(this.ingredient, this.ingredientService, this.unitService);
  }

  CallOnDeletedSafe() {
    if (this.OnDeleted) {
      this.OnDeleted(this.ingredient)
    };
  }
}
