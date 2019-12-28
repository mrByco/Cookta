import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {IngredientService} from "../../../shared/services/ingredient.service";
import {UnitService} from "../../../shared/services/unit.service";
import {IIngredient} from "../../../shared/models/grocery/ingredient.interface";
import {AutoCompleteComponent} from "../../../utilities/auto-complete/auto-complete.component";
import {IngredientType} from "../../../shared/models/grocery/ingredient-type.model";
import {Unit} from "../../../shared/models/unit.interface";
import {IDisplayable} from "../../../utilities/displayable";

@Component({
  selector: 'app-ingredient-adder',
  templateUrl: './ingredient-adder.component.html',
  styleUrls: ['./ingredient-adder.component.css']
})
export class IngredientAdderComponent implements OnInit {

  @Input('IngredientAdded') AddIngredient: (IIngredient) => void;

  @ViewChild("TypeSelector", {static: true}) TypeSelector: AutoCompleteComponent;

  public get CurrentType() {
    return this.m_CurrentType
  }
  public set CurrentType(value: IngredientType) {
    this.m_CurrentType = value;
    this.RefreshDone();
  }
  m_CurrentType: IngredientType;

  public get CurrentValue() {
    return this.m_CurrentValue
  }
  public set CurrentValue(value: number) {
    this.m_CurrentValue = value;
    this.RefreshDone();
  }
  m_CurrentValue: number;

  public get CurrentUnit() {
    return this.m_CurrentUnit
  }
  public set CurrentUnit(value: Unit) {
    this.m_CurrentUnit = value;
    this.RefreshDone();
  }
  m_CurrentUnit: Unit;

  public AvailableUnits: Unit[];

  private async RefreshAvailableUnits(){
    this.CurrentUnit = null;
    if (!this.CurrentType){
      this.AvailableUnits = [];
      return;
    }
    this.unitService.GetAvailableUnitsFor(this.CurrentType).then((units) => this.AvailableUnits = units);
  }

  public Done: boolean = false;
  private RefreshDone(){
    this.Done = this.CurrentType != null && this.CurrentValue != null && this.CurrentUnit != null;
  }

  constructor(private ingredientService: IngredientService,
              private unitService: UnitService) { }

  ngOnInit() {
  }

  OnTypeSelected(item: IDisplayable) {
    // if (!this.TypeSelector){
    //   return;
    // }
    this.CurrentType = item as IngredientType;
    this.RefreshAvailableUnits();
  }

  OnUnitSelected(unit: Unit) {
    this.CurrentUnit = unit;
  }
}
