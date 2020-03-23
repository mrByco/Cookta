import {Component, Input, OnInit} from '@angular/core';
import {IIngredient} from "../../shared/models/grocery/ingredient.interface";
import {DisplayIngredient} from "../../shared/ingredient-display";
import {IngredientService} from "../../shared/services/ingredient.service";
import {UnitService} from "../../shared/services/unit.service";

@Component({
  selector: 'app-essentials-list',
  templateUrl: './essentials-list.component.html',
  styleUrls: ['./essentials-list.component.css']
})
export class EssentialsListComponent implements OnInit {
  private m_items: DisplayIngredient[] = [];

  private Editing: boolean;

  public get Items() {
    return this.m_items.map(v => v.ingredientSource);
  }
  public set Items(value){
    this.m_items = value.map(v => new DisplayIngredient(v, this.ingredientService, this.unitService));
  }

  constructor(private ingredientService: IngredientService,
              private unitService: UnitService) { }

  ngOnInit() {
    this.Items = [{"ingredientID":"19a8f092-358c-43be-acbf-eae77493ded5","unit":"glass","value":4},{"ingredientID":"e74d3104-1160-49d8-8428-ab686cb8311a","unit":"line","value":5},{"ingredientID":"faf3f6aa-88c5-4c2b-8581-bbf3b70b1204","unit":"df819ef1-aea7-cb81-8c54-0a429496634c","value":8},{"ingredientID":"19a8f092-358c-43be-acbf-eae77493ded5","unit":"glass","value":4},{"ingredientID":"e74d3104-1160-49d8-8428-ab686cb8311a","unit":"line","value":5},{"ingredientID":"faf3f6aa-88c5-4c2b-8581-bbf3b70b1204","unit":"df819ef1-aea7-cb81-8c54-0a429496634c","value":8},{"ingredientID":"19a8f092-358c-43be-acbf-eae77493ded5","unit":"glass","value":4},{"ingredientID":"e74d3104-1160-49d8-8428-ab686cb8311a","unit":"line","value":5},{"ingredientID":"faf3f6aa-88c5-4c2b-8581-bbf3b70b1204","unit":"df819ef1-aea7-cb81-8c54-0a429496634c","value":8},{"ingredientID":"19a8f092-358c-43be-acbf-eae77493ded5","unit":"glass","value":4},{"ingredientID":"e74d3104-1160-49d8-8428-ab686cb8311a","unit":"line","value":5},{"ingredientID":"faf3f6aa-88c5-4c2b-8581-bbf3b70b1204","unit":"df819ef1-aea7-cb81-8c54-0a429496634c","value":8},{"ingredientID":"19a8f092-358c-43be-acbf-eae77493ded5","unit":"glass","value":4},{"ingredientID":"e74d3104-1160-49d8-8428-ab686cb8311a","unit":"line","value":5},{"ingredientID":"faf3f6aa-88c5-4c2b-8581-bbf3b70b1204","unit":"df819ef1-aea7-cb81-8c54-0a429496634c","value":8},{"ingredientID":"19a8f092-358c-43be-acbf-eae77493ded5","unit":"glass","value":4},{"ingredientID":"e74d3104-1160-49d8-8428-ab686cb8311a","unit":"line","value":5},{"ingredientID":"faf3f6aa-88c5-4c2b-8581-bbf3b70b1204","unit":"df819ef1-aea7-cb81-8c54-0a429496634c","value":8},{"ingredientID":"19a8f092-358c-43be-acbf-eae77493ded5","unit":"glass","value":4},{"ingredientID":"e74d3104-1160-49d8-8428-ab686cb8311a","unit":"line","value":5},{"ingredientID":"faf3f6aa-88c5-4c2b-8581-bbf3b70b1204","unit":"df819ef1-aea7-cb81-8c54-0a429496634c","value":8},{"ingredientID":"19a8f092-358c-43be-acbf-eae77493ded5","unit":"glass","value":4},{"ingredientID":"e74d3104-1160-49d8-8428-ab686cb8311a","unit":"line","value":5},{"ingredientID":"faf3f6aa-88c5-4c2b-8581-bbf3b70b1204","unit":"df819ef1-aea7-cb81-8c54-0a429496634c","value":8}]
  }

  public async ToggleEdit() {
    this.Editing = !this.Editing;
  }
}
