import {Component, Input, OnInit} from '@angular/core';
import {DisplayIngredient} from "../../shared/ingredient-display";
import {IIngredient} from "../../shared/models/grocery/ingredient.interface";
import {ShoppingService} from "../../shared/services/shopping-service/shopping.service";
import {UnitService} from "../../shared/services/unit.service";
import {IngredientService} from "../../shared/services/ingredient.service";
import {StorageSection} from "../../shared/models/storage/storage-section.model";
import {StorageService} from "../../shared/services/storage.service";
import {ICompleteIngredient, IngredientHelper} from '../../utilities/ingredient-helper/ingredient.helper';

@Component({
  selector: 'app-shopping-list-panel',
  templateUrl: './shopping-list-panel.component.html',
  styleUrls: ['./shopping-list-panel.component.css']
})
export class ShoppingListPanelComponent implements OnInit {

  @Input('PackSection') public storageSection: StorageSection;

  constructor(public shoppingListService: ShoppingService,
              public unitService: UnitService,
              public ingredientService: IngredientService,
              public storageService: StorageService) {}

  ngOnInit() {
  }

  PutToStorage(ing: IIngredient) {
    let existingSameType: IIngredient = this.storageSection.Items.find(i => i.ingredientID == ing.ingredientID);

    if (existingSameType){
      let completeExisting: ICompleteIngredient = IngredientHelper.ToCompleteIngredient(existingSameType, this.unitService, this.ingredientService);
      let completeIng: ICompleteIngredient = IngredientHelper.ToCompleteIngredient(ing, this.unitService, this.ingredientService);
      let completeAdded = IngredientHelper.Add(completeExisting, completeIng);

      this.storageSection.Items[this.storageSection.Items.indexOf(existingSameType)] =
        {
          ingredientID: completeAdded.ingredientType.guid,
          unit: completeAdded.unit.id,
          value: completeAdded.value,
        };
    }
    else
      this.storageSection.Items.push(ing);
    this.shoppingListService.ShoppingItems.splice(this.shoppingListService.ShoppingItems.indexOf(ing), 1);
    this.storageService.SetStorageSectionOnRemote({Id: this.storageSection.Id, Items: this.storageSection.Items})
  }
}
