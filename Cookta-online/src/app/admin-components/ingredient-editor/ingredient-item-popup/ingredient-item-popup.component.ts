import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {IngredientType} from '../../../shared/models/grocery/ingredient-type.model';
import {ModalDirective} from 'angular-bootstrap-md';
import {IngredientService} from '../../../shared/services/ingredient-service/ingredient.service';
import {Guid} from 'guid-typescript';
import {EUnitType} from '../../../shared/models/grocery/unit-type.enum';
import {Unit} from '../../../shared/models/unit.interface';
import {UnitService} from '../../../shared/services/unit-service/unit.service';

@Component({
  selector: 'app-ingredient-item-popup',
  templateUrl: './ingredient-item-popup.component.html',
  styleUrls: ['./ingredient-item-popup.component.css']
})
export class IngredientItemPopupComponent implements OnInit {

  @Input() set Ingredient(value: IngredientType) {
    this.CurrentGuid = value.guid;
    this.CurrentCategory = value.category;
    this.CurrentName = value.name;
    this.CurrentBaseUnit = value.baseUnit;
    this.CurrentBaseUnitType = value.baseUnitType != undefined ? value.baseUnitType : 0;
    this.CurrentInShopping = value.inshopping;
    this.CurrentCustomUnits = value.options && value.options.cunits ? [...value.options.cunits]: [];
    console.log(value.baseUnitType != undefined);

  };


  public CurrentGuid: string = "";
  public CurrentCategory: string = "";
  public CurrentName: string = "";
  public CurrentBaseUnit: string = "";
  public get CurrentBaseUnitType(){
    return this.m_CurrentBaseUnitType;
  };
  public set CurrentBaseUnitType(value){
    if (typeof(value) == "string") value = (+value) as EUnitType;
    this.m_CurrentBaseUnitType = value;
  };
  private m_CurrentBaseUnitType: EUnitType;
  public CurrentInShopping: string = "";
  public CurrentCustomUnits: Unit[] = [];


  @ViewChild('basicModal', {static: true}) public modal: ModalDirective;


  constructor(public IngredientService: IngredientService) {
  }

  ngOnInit() {
  }

  public Open(){
    this.modal.show();
  }
  public Close(){
    this.modal.hide();
  }

  PushNewUnit() {
    this.CurrentCustomUnits.push({
      id: Guid.create().toString(),
      name: "",
      tobase: 0,
      shortname: "",
      type: this.CurrentBaseUnitType
    })
  }

  DeleteCustomUnit(unit: Unit) {
    this.CurrentCustomUnits.splice(this.CurrentCustomUnits.findIndex(u => u == unit), 1);
  }

  //Check methods
  public SaveEnabled: boolean;
  RefreshSaveEnabled(){
    let AllParamsValid = (): boolean => {
      if (IngredientService.IsValidCategoryName(this.CurrentCategory))
        return false;
      if (IngredientService.IsValidIngredientName(this.CurrentName))
        return false;
      for (let unit of this.CurrentCustomUnits){
        if (UnitService.IsValidUnitName(unit.name))
          return false;
        if (UnitService.IsValidToBase(unit.tobase))
          return false;
      }
      return true;
    }
    this.SaveEnabled = AllParamsValid();
  }

  IsValidUnitName(name: string): boolean {
    this.RefreshSaveEnabled();
    return UnitService.IsValidUnitName(name) == undefined;
  }

  IsValidToBase(tobase: number): boolean {
    this.RefreshSaveEnabled();
    return UnitService.IsValidToBase(tobase) == undefined;
  }

  IsValidIngredientName(CurrentName: string): boolean {
    this.RefreshSaveEnabled();
    return IngredientService.IsValidIngredientName(CurrentName) == undefined;
  }

  IsValidIngredientCategory(CurrentCategory: string): boolean {
    this.RefreshSaveEnabled();
    return IngredientService.IsValidCategoryName(CurrentCategory) == undefined;
  }

  public async SaveCurrent() {
    console.log(this.CurrentCategory, this.CurrentName, this.CurrentBaseUnit, this.CurrentBaseUnitType, this.CurrentInShopping, this.CurrentGuid, {cunits: this.CurrentCustomUnits});
    await this.IngredientService.SaveIngredient(new IngredientType(this.CurrentCategory, this.CurrentName, this.CurrentBaseUnit, this.CurrentBaseUnitType, this.CurrentInShopping, this.CurrentGuid, {cunits: this.CurrentCustomUnits}));
    this.Close();
  }
}
