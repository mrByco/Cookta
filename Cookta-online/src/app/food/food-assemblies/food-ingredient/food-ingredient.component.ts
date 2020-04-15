import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IIngredient} from '../../../shared/models/grocery/ingredient.interface';
import {IngredientService} from '../../../shared/services/ingredient-service/ingredient.service';
import {UnitService} from '../../../shared/services/unit-service/unit.service';
import {DisplayIngredient} from '../../../shared/ingredient-display';


@Component({
  selector: 'app-food-ingredient',
  templateUrl: './food-ingredient.component.html',
  styleUrls: ['./food-ingredient.component.css']
})
export class FoodIngredientComponent implements OnInit {

  @Input('ingredient') private ingredient: IIngredient;
  @Input('edit') public edit: boolean = false;
  @Output('OnDeleted')  OnDeleted: EventEmitter<IIngredient> = new EventEmitter<IIngredient>();
  @Input('ShortUnitNames') public set ShowShortUnitNames(value) {
    this.m_ShowShortUnitNames = value;
  }
  public m_ShowShortUnitNames: boolean;

  public displayIngredient: DisplayIngredient;

  constructor(
      public ingredientService: IngredientService,
      public unitService: UnitService) {
  }

  ngOnInit() {
    this.displayIngredient = new DisplayIngredient(this.ingredient, this.ingredientService, this.unitService);
  }

  DeleteThis() {
    this.OnDeleted.emit(this.ingredient);
  }

  ValidateInputValue() {
    this.displayIngredient.Value = this.displayIngredient.Value;
  }
}
