import {Component, OnInit} from '@angular/core';
import {ShoppingService} from '../../shared/services/shopping-service/shopping.service';
import {IngredientService} from '../../shared/services/ingredient-service/ingredient.service';
import {StorageService} from '../../shared/services/storage.service';
import {StorageSection} from '../../shared/models/storage/storage-section.model';
import {UnitService} from '../../shared/services/unit-service/unit.service';

@Component({
  selector: 'app-shopping-list-root',
  templateUrl: './shopping-list-root.component.html',
  styleUrls: ['./shopping-list-root.component.css']
})
export class ShoppingListRootComponent implements OnInit {

  public SelectedSection: StorageSection;
  get selected(){
    return this.m_selected;
  }
  set selected(v){
    if (v != this.m_selected) this.shoppingService.SetShoppingDate(new Date(Date.now() + v * 24 * 60 * 60 * 1000));
    this.m_selected = v;
  }

  private m_selected;

  constructor(public shoppingService: ShoppingService,
              public storageService: StorageService,
              public ingredientService: IngredientService,
              public unitService: UnitService) {
    shoppingService.RefreshShoppingItems();
    this.storageService.RefreshStorageSections().then(async () => {
      if (storageService.Sections.length == 0) {
        await storageService.CreateStorageSection();
      }
      this.SelectedSection = storageService.Sections[0];
    });
  }


  ngOnInit() {

  }


  public GetDateStringFromMilis(milis: number): string {
    let now = new Date(milis);
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  }

  private static copyStringToClipboard(str) {
    // Create new element
    var el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);

  }

  public async CopyListToClipboard() {
    let foodStrings = await Promise.all(this.shoppingService.CurrentShoppingList.IngredientsToBuy.map(async (item) => {
      let ing = await this.ingredientService.GetIngredient(item.ingredientID);
      let unit = this.unitService.GetUnit(item.unit, ing).name;
      return `${item.value} ${unit ? unit : item.unit}  ${ing.name ? ing.name : `Ismeretlen: ${item.ingredientID}`}`;
    }));
    ShoppingListRootComponent.copyStringToClipboard(
      `Bevásárló lista: ${this.shoppingService.GetSelectedShoppingDate.toISOString().slice(0, 10)}-ig\n` + foodStrings.join('\n'));
    alert('Lista másolva');
  }

  public ChangeNextShoppingDay(event: string) {
    let year = +event.split('-')[0];
    let month = +event.split('-')[1] - 1;
    let date = +event.split('-')[2];
    let dateObj = new Date(year, month, date);
    console.log(dateObj);
    this.shoppingService.SetShoppingDate(dateObj);
  }
}
