import {Component, Input} from '@angular/core';
import {ShoppingService} from '../../shared/services/shopping-service/shopping.service';
import {UnitService} from '../../shared/services/unit-service/unit.service';
import {IngredientService} from '../../shared/services/ingredient-service/ingredient.service';
import {StorageSection} from '../../shared/models/storage/storage-section.model';

@Component({
  selector: 'app-shopping-list-panel',
  templateUrl: './shopping-list-panel.component.html',
  styleUrls: ['./shopping-list-panel.component.css']
})
export class ShoppingListPanelComponent {

  @Input('PackSection') public storageSection: StorageSection;

  constructor(public shoppingListService: ShoppingService,
              public unitService: UnitService,
              public ingredientService: IngredientService) {
  }

}
