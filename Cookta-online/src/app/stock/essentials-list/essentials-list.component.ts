import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IIngredient} from "../../shared/models/grocery/ingredient.interface";
import {DisplayIngredient} from "../../shared/ingredient-display";
import {IngredientService} from "../../shared/services/ingredient.service";
import {UnitService} from "../../shared/services/unit.service";
import {EssentialsService} from "../../shared/services/essentials.service";
import {ModalDirective} from "angular-bootstrap-md";

@Component({
  selector: 'app-essentials-list',
  templateUrl: './essentials-list.component.html',
  styleUrls: ['./essentials-list.component.css']
})
export class EssentialsListComponent implements OnInit, OnDestroy {

  @ViewChild('editModal', {static: true}) EditModal: ModalDirective;

  constructor(public ingredientService: IngredientService,
              public unitService: UnitService,
              public essentialsService: EssentialsService) {
    essentialsService.OnEssentialsChanged.subscribe(i => this.displays = essentialsService.GetDisplays())
  }

  ngOnInit() {
    this.essentialsService.RefreshEssentials();
  }

  public displays: DisplayIngredient[] = [];

  public Editing: boolean;

  public async ToggleEdit() {
    if (this.Editing){
      this.essentialsService.PushEssentials()
    }
    this.Editing = !this.Editing;
  }

  public AddIngredientToEssentials(ingredient: IIngredient) {
    this.essentialsService.PushEssential({ingredientID: ingredient.ingredientID, unit: ingredient.unit, value: ingredient.value});
  }

  DeleteEssential(i: number) {
    this.essentialsService.RemoveEssential(i);
  }


  ngOnDestroy(): void {
    if (this.Editing)
    this.essentialsService.PushEssentials()
  }
}
