import { Component, OnInit } from '@angular/core';
import {ShoppingService} from "../../shared/services/shopping-service/shopping.service";
import {IngredientService} from "../../shared/services/ingredient.service";
import {StorageService} from "../../shared/services/storage.service";
import {StorageSection} from "../../shared/models/storage/storage-section.model";

@Component({
  selector: 'app-shopping-list-root',
  templateUrl: './shopping-list-root.component.html',
  styleUrls: ['./shopping-list-root.component.css']
})
export class ShoppingListRootComponent implements OnInit {

  public SelectedSection: StorageSection;

  constructor(public shoppingService: ShoppingService,
              public storageService: StorageService) {
    shoppingService.RefreshShoppingItems();
    this.storageService.RefreshStorageSections().then(async () => {
      if (storageService.Sections.length  == 0){
        await storageService.CreateStorageSection();
      }
      this.SelectedSection = storageService.Sections[0];
    });
  }


  ngOnInit() {

  }


  public GetDateStringWithOffset(days: number): string {
    let now = new Date(Date.now());
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + days).toDateString();
  }

}
