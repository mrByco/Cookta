import {Component, OnInit} from '@angular/core';
import {DisplayIngredient} from "../../shared/ingredient-display";
import {IIngredient} from "../../shared/models/grocery/ingredient.interface";
import {ShoppingService} from "../../shared/services/shopping-service/shopping.service";
import {UnitService} from "../../shared/services/unit.service";
import {IngredientService} from "../../shared/services/ingredient.service";
import {StorageSection} from "../../shared/models/storage/storage-section.model";
import {StorageService} from "../../shared/services/storage.service";

@Component({
  selector: 'app-shopping-list-panel',
  templateUrl: './shopping-list-panel.component.html',
  styleUrls: ['./shopping-list-panel.component.css']
})
export class ShoppingListPanelComponent implements OnInit {


  constructor(public shoppingListService: ShoppingService,
              public unitService: UnitService,
              public ingredientService: IngredientService) {

  }

  ngOnInit() {
  }

  PutToStorage(ing: IIngredient) {

  }
}
