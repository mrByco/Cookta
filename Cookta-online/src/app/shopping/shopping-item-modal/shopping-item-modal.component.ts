import {Component, ViewChild} from '@angular/core';
import {ModalDirective} from "angular-bootstrap-md";
import {IShoppingIngredient} from "../../../../../Cookta-shared/src/models/shopping-list/shopping-list.interface";
import {IngredientService} from "../../shared/services/ingredient-service/ingredient.service";
import {UnitService} from "../../shared/services/unit-service/unit.service";
import {IIngredientRelatives} from "../../../../../Cookta-shared/src/models/shopping-list/shopping-ingredient-relatives";
import {IngredientType} from "../../shared/models/grocery/ingredient-type.model";
import {StorageService} from "../../shared/services/storage.service";
import {FoodService} from "../../shared/services/food.service";

@Component({
  selector: 'app-shopping-item-modal',
  templateUrl: './shopping-item-modal.component.html',
  styleUrls: ['./shopping-item-modal.component.css']
})
export class ShoppingItemModalComponent {

  @ViewChild(ModalDirective) Modal: ModalDirective;

  constructor(public ingredientService: IngredientService, public unitService: UnitService, public storageService: StorageService, public foodService: FoodService) {
  }

   ItemType: IngredientType;
   ItemValue: number;
   UnitName: string;
   Relatives: IIngredientRelatives;

  public FoodNameCache = {};

  Open(item: IShoppingIngredient){
    this.ItemType = this.ingredientService.GetIngredient(item.ingredientID);
    this.ItemValue = item.value;
    this.UnitName = this.unitService.GetUnit(item.unit, this.ItemType).name;
    this.Relatives = item.Relatives;
    this.Relatives.MenuItems.forEach((i) => {
      if (!this.FoodNameCache[i.food]) {
        this.FoodNameCache[i.food] = '';
        this.foodService.GetFood(i.food).then(food => this.FoodNameCache[i.food] = food.name);
      }
    });
    console.log(this.ItemType, this.ItemValue, this.UnitName, this.Relatives)
    this.Modal.show();
  }

}
