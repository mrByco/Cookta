import {Component, Input} from '@angular/core';
import {IIngredient} from '../../shared/models/grocery/ingredient.interface';
import {ShoppingService} from '../../shared/services/shopping-service/shopping.service';
import {UnitService} from '../../shared/services/unit-service/unit.service';
import {IngredientService} from '../../shared/services/ingredient-service/ingredient.service';
import {StorageSection} from '../../shared/models/storage/storage-section.model';
import {StorageService} from '../../shared/services/storage.service';

@Component({
  selector: 'app-shopping-list-panel',
  templateUrl: './shopping-list-panel.component.html',
  styleUrls: ['./shopping-list-panel.component.css']
})
export class ShoppingListPanelComponent {

  @Input('PackSection') public storageSection: StorageSection;

  constructor(public shoppingListService: ShoppingService,
              public unitService: UnitService,
              public ingredientService: IngredientService,
              public storageService: StorageService) {
  }

  PutToStorage(ing: IIngredient) {
    this.storageService.AddIngredientToSection(ing, this.storageSection, true);
    this.shoppingListService.ShoppingItems.splice(this.shoppingListService.ShoppingItems.indexOf(ing), 1);
  }
}
