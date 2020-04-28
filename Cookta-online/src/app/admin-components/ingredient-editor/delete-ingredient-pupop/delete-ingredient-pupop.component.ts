import {Component, OnInit, ViewChild} from '@angular/core';
import {IngredientType} from '../../../shared/models/grocery/ingredient-type.model';
import {IDeleteIngredientTypeResponse} from '../../../../../../Cookta-shared/src/contracts/ingredient-type/delete-ingredient-type';
import {ModalDirective} from 'angular-bootstrap-md';
import {AutoCompleteComponent} from '../../../utilities/auto-complete/auto-complete.component';
import {IngredientService} from '../../../shared/services/ingredient-service/ingredient.service';
import {IDisplayable} from '../../../utilities/displayable';

@Component({
  selector: 'app-delete-ingredient-pupop',
  templateUrl: './delete-ingredient-pupop.component.html',
  styleUrls: ['./delete-ingredient-pupop.component.css']
})
export class DeleteIngredientPupopComponent implements OnInit {

  constructor(public ingredientService: IngredientService) { }

  @ViewChild(ModalDirective) private modalRef: ModalDirective;
  @ViewChild(ModalDirective) private suggestionBox: AutoCompleteComponent;


  public CurrentSelectedDescendent: IngredientType;
  public IngredientToDelete: IngredientType;

  public LastResponse: IDeleteIngredientTypeResponse;
  public AvailableDescendents: IngredientType[];

  ngOnInit(): void {
  }

  async DeleteIngredient(type: IngredientType, descendent: IngredientType = undefined, forced: boolean = false) {
    this.IngredientToDelete = type;
    this.AvailableDescendents =
      this.ingredientService.LastLoadedTypes.filter(f => f.baseUnitType == type.baseUnitType)
    this.LastResponse = null;
    this.modalRef.show();

    this.ingredientService.DeleteIngredientType({forced: forced, descendentId: descendent?.guid, ingredientTypeId: type.guid, migrateCustomUnits: false}).then(r => this.LastResponse = r);
  }

  SelectDescendent(descendent: IDisplayable) {
    this.CurrentSelectedDescendent = descendent as IngredientType;
  }
}
