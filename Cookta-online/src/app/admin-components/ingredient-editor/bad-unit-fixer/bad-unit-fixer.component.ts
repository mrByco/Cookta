import {Component} from '@angular/core';
import {IBadUnit} from "../../../../../../Cookta-shared/src/models/unit/bad-unit.interface";
import {UnitService} from "../../../shared/services/unit-service/unit.service";
import {IngredientService} from "../../../shared/services/ingredient-service/ingredient.service";

@Component({
  selector: 'app-bad-unit-fixer',
  templateUrl: './bad-unit-fixer.component.html',
  styleUrls: ['./bad-unit-fixer.component.css']
})
export class BadUnitFixerComponent {

  public BadUnits: IBadUnit[];

  constructor(public unitService: UnitService, public ingredientService: IngredientService) {
    unitService.GetBadUnits().then(bu => {
      this.BadUnits = bu;
    })
  }

  FixBadUnit(badUnit: IBadUnit) {
    this.BadUnits = undefined;
    this.unitService.FixBadUnit(badUnit).then(bu => this.BadUnits = bu);
  }

}
