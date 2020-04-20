import {Component, OnInit, ViewChild} from '@angular/core';
import {Unit} from '../../../shared/models/unit.interface';
import {UnitService} from 'src/app/shared/services/unit-service/unit.service';
import {IngredientType} from '../../../shared/models/grocery/ingredient-type.model';
import {ModalDirective} from 'angular-bootstrap-md';
import {CheckIngredientRefResponse} from '../../../../../../Cookta-shared/src/contracts/ingredient-type/check-ingredient.contrats';

@Component({
  selector: 'app-delete-custom-unit-popup',
  templateUrl: './delete-custom-unit-popup.component.html',
  styleUrls: ['./delete-custom-unit-popup.component.css']
})
export class DeleteCustomUnitPopupComponent {

  @ViewChild(ModalDirective) private modalRef: ModalDirective;

  constructor(public unitService: UnitService) { }
  public CurrentUnit: Unit;
  public CurrentType: IngredientType;
  public Descendent: string;
  public ReferenceCheck: CheckIngredientRefResponse;
  public CheckText: string = '';
  public get CheckTextOk(): boolean {
    return this.CurrentUnit?.name == this.CheckText;
  }


  OpenUnit(unit: Unit, type: IngredientType) {
    this.CurrentUnit = unit;
    this.CurrentType = type;
    this.modalRef.show();
  }

  public GetDescentUnits(): Unit[] {
    return this.unitService.GetAvailableUnitsFor(this.CurrentType).filter(u => u.id != this.CurrentUnit.id);
  }

}
