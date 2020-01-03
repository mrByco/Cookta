import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {IngredientType} from "../../../shared/models/grocery/ingredient-type.model";
import {ModalDirective} from "angular-bootstrap-md";

@Component({
  selector: 'app-ingredient-item-popup',
  templateUrl: './ingredient-item-popup.component.html',
  styleUrls: ['./ingredient-item-popup.component.css']
})
export class IngredientItemPopupComponent implements OnInit {

  @Input() set Ingredient(value: IngredientType) {
    this.currentType = new IngredientType(
      value.category,
      value.name,
      value.baseUnit,
      value.volumeEnabled,
      value.CountEnabled,
      value.massEnabled,
      value.inshopping,
      value.guid,
      value.options);
  };
  public currentType: IngredientType;


  @ViewChild('basicModal', {static: true}) public modal: ModalDirective;

  constructor() { }

  ngOnInit() {
  }

  public Open(){
    this.modal.show();
  }
  public Close(){
    this.modal.hide();
  }

}
