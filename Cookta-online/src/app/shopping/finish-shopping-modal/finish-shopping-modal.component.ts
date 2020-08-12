import {Component, ViewChild} from '@angular/core';
import {ShoppingService} from '../../shared/services/shopping-service/shopping.service';
import {ModalDirective} from 'angular-bootstrap-md';
import {UnitService} from '../../shared/services/unit-service/unit.service';
import {IngredientService} from '../../shared/services/ingredient-service/ingredient.service';
import {StorageService} from '../../shared/services/storage.service';
import { ICompletedShoppingItem } from '../../../../../Cookta-shared/src/models/shopping-list/shopping-list.interface';

@Component({
  selector: 'app-finish-shopping-modal',
  templateUrl: './finish-shopping-modal.component.html',
  styleUrls: ['./finish-shopping-modal.component.css']
})
export class FinishShoppingModalComponent {

  @ViewChild(ModalDirective) public modal: ModalDirective;

  constructor(public shoppingService: ShoppingService,
              public storageService: StorageService,
              public unitService: UnitService,
              public ingredientService: IngredientService) { }

  Show(){
    this.modal.show();
  }

  setTargetSection(shopped: ICompletedShoppingItem, Id: string) {
    shopped.ShippingSectionId = Id;
    this.shoppingService.SaveCompletedQuantity(shopped);
  }
}
