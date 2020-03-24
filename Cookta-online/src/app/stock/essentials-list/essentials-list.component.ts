import {Component, Input, OnInit} from '@angular/core';
import {IIngredient} from "../../shared/models/grocery/ingredient.interface";
import {DisplayIngredient} from "../../shared/ingredient-display";
import {IngredientService} from "../../shared/services/ingredient.service";
import {UnitService} from "../../shared/services/unit.service";
import {EssentialsService} from "../../shared/services/essentials.service";

@Component({
  selector: 'app-essentials-list',
  templateUrl: './essentials-list.component.html',
  styleUrls: ['./essentials-list.component.css']
})
export class EssentialsListComponent implements OnInit {

  private Editing: boolean;


  constructor(private ingredientService: IngredientService,
              private unitService: UnitService,
              private essentialsService: EssentialsService) { }

  ngOnInit() {

  }

  public async ToggleEdit() {
    this.Editing = !this.Editing;
  }

}
