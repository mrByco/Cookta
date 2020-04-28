import {Component, ViewChild} from '@angular/core';
import {Unit} from '../../../shared/models/unit.interface';
import {UnitService} from 'src/app/shared/services/unit-service/unit.service';
import {IngredientType} from '../../../shared/models/grocery/ingredient-type.model';
import {ModalDirective} from 'angular-bootstrap-md';
import {CheckUnitRefResponse} from '../../../../../../Cookta-shared/src/contracts/ingredient-type/check-ingredient.contrats';
import {IngredientService} from '../../../shared/services/ingredient-service/ingredient.service';
import {delay} from 'rxjs/operators';

@Component({
  selector: 'app-delete-custom-unit-popup',
  templateUrl: './delete-custom-unit-popup.component.html',
  styleUrls: ['./delete-custom-unit-popup.component.css']
})
export class DeleteCustomUnitPopupComponent {

  @ViewChild(ModalDirective) private modalRef: ModalDirective;

  constructor(public unitService: UnitService, public ingredientService: IngredientService) { }
  public CurrentUnit: Unit;
  public CurrentType: IngredientType;
  public Descendent: string;
  public ReferenceCheck: CheckUnitRefResponse;
  public CheckText: string = '';
  public Processing: boolean = false;
  public get CheckTextOk(): boolean {
    return this.CurrentUnit?.name == this.CheckText;
  }


  OpenUnit(unit: Unit, type: IngredientType) {
    this.CheckText = '';
    this.Processing = false;
    this.CurrentUnit = unit;
    this.CurrentType = type;
    this.modalRef.show();
    this.ReferenceCheck = undefined;
    console.log(this.CurrentUnit.id);
    this.ingredientService.GetUsageOfCustomUnit(this.CurrentUnit).then(r => this.ReferenceCheck = r);
  }

  public GetDescentUnits(): Unit[] {
    return this.unitService.GetAvailableUnitsFor(this.CurrentType).filter(u => u.id != this.CurrentUnit.id);
  }

  async Process() {
    this.Processing = true;
    await this.ingredientService.DeleteCustomUnit(this.CurrentType, this.CurrentUnit, this.Descendent);
    await delay(300);
    this.modalRef.hide();
    await delay(100);
    location.reload();
  }

}
