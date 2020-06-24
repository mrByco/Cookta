import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IIngredient} from '../../../shared/models/grocery/ingredient.interface';
import {IngredientService} from '../../../shared/services/ingredient-service/ingredient.service';
import {UnitService} from '../../../shared/services/unit-service/unit.service';
import {DisplayIngredient} from '../../../shared/ingredient-display';
import {StorageService} from '../../../shared/services/storage.service';
import {IngredientHelper} from '../../../utilities/ingredient-helper/ingredient.helper';
import {StorageSection} from '../../../shared/models/storage/storage-section.model';

interface IngredientCheckResult {
  sections: { section: StorageSection, ingredient: DisplayIngredient }[];
  sum: DisplayIngredient;
  isOk: boolean;
}


@Component({
  selector: 'app-food-ingredient',
  templateUrl: './food-ingredient.component.html',
  styleUrls: ['./food-ingredient.component.css']
})
export class FoodIngredientComponent implements OnInit {

  @Input('edit') public edit: boolean = false;
  @Input('ingredientDisplayMultiplier') public displayMultiplier = 1;
  @Input('CheckIngredientAtHome') public CheckIngredientsAtHome: boolean;
  @Output('OnDeleted') OnDeleted: EventEmitter<IIngredient> = new EventEmitter<IIngredient>();
  public m_ShowShortUnitNames: boolean;
  public displayIngredient: DisplayIngredient;
  public CheckResult: IngredientCheckResult;
  @Input('ingredient') private ingredient: IIngredient;

  constructor(
    public ingredientService: IngredientService,
    public unitService: UnitService,
    public storageService: StorageService) {
  }

  @Input('ShortUnitNames')
  public set ShowShortUnitNames(value) {
    this.m_ShowShortUnitNames = value;
  }

  ngOnInit() {
    this.displayIngredient = new DisplayIngredient(this.ingredient, this.ingredientService, this.unitService);

    if (this.CheckIngredientsAtHome){
      this.DoIngredientCheck();
      this.storageService.OnSecrionsRefreshed.subscribe(r => {
        this.DoIngredientCheck();
      });
    }
  }

  DeleteThis() {
    this.OnDeleted.emit(this.ingredient);
  }

  ValidateInputValue() {
    this.displayIngredient.Value = this.displayIngredient.Value;
  }

  private DoIngredientCheck() {
    if (!this.ingredient) return;
    let requirement = IngredientHelper.ToCompleteIngredient(this.ingredient, this.unitService, this.ingredientService);
    let storagesToCheck = this.storageService.FindStoragesByIngredientType(requirement.ingredientType.guid);
    let ingredientsFoundAtHome: { seciton: StorageSection, ingredient: IIngredient }[] = [];
    for (let section of storagesToCheck) {
      for (let item of section.Items) {
        if (item.ingredientID != requirement.ingredientType.guid) continue;
        ingredientsFoundAtHome.push({ingredient: item, seciton: section});
        break;
      }
    }
    let completeAtHome = IngredientHelper.ToCompleteIngredientList(ingredientsFoundAtHome.map(i => i.ingredient), this.unitService, this.ingredientService);

    let isOk = IngredientHelper.MergeIngredients([{
      ingredientType: requirement.ingredientType,
      value: -requirement.value,
      unit: requirement.unit
    },
      ...completeAtHome])[0].value > 0;

    let completeSum = IngredientHelper.MergeIngredients(completeAtHome)[0];
    let sum: IIngredient = completeSum ? {ingredientID: completeSum.ingredientType.guid, unit: completeSum.unit.id, value: completeSum.value} : undefined;


    let result: IngredientCheckResult = {
      isOk: isOk,
      sections: ingredientsFoundAtHome.map(i => {
        return {
          section: i.seciton,
          ingredient: new DisplayIngredient(i.ingredient, this.ingredientService, this.unitService)
        };
      }),
      sum: sum ? new DisplayIngredient(sum, this.ingredientService, this.unitService) : undefined
    };
    console.log(result);
    this.CheckResult = result;
  }
}
