import {Component, Input, OnInit} from '@angular/core';
import {IStorageItemChangeRequest, StorageSection} from '../../shared/models/storage/storage-section.model';
import {IIngredient} from '../../shared/models/grocery/ingredient.interface';
import {StorageService} from 'src/app/shared/services/storage.service';
import {GenericTwoButtonDialogComponent} from '../../utilities/generic-two-button-dialog/generic-two-button-dialog.component';
import {MDBModalService} from 'angular-bootstrap-md';
import {UnitService} from '../../shared/services/unit-service/unit.service';
import {IngredientService} from '../../shared/services/ingredient-service/ingredient.service';

@Component({
  selector: 'app-storage-section',
  templateUrl: './storage-section.component.html',
  styleUrls: ['./storage-section.component.css']
})
export class StorageSectionComponent implements OnInit {

  constructor(public storageSectionService: StorageService,
              public modalService: MDBModalService,
              public unitService: UnitService,
              public ingredientService: IngredientService) {
  }

  public ModifiedFields: string[]

  @Input() CurrentSection: StorageSection;
  @Input() public SelectedItems: IIngredient[] = [];
  @Input() public SearchResults: {section: StorageSection, ingredients: IIngredient[]}[] = [];

  public async ToggleItemSelect(item: IIngredient) {
    if (this.ModifiedFields)
      return;

    if (this.SelectedItems.includes(item)) {
      this.SelectedItems.splice(this.SelectedItems.indexOf(item), 1);
    } else {
      this.SelectedItems.push(item);
    }
  };

  ngOnInit() {
  }

  public ToggleEditSection() {
    if (this.ModifiedFields) {
      let modifyRequest: IStorageItemChangeRequest = {
        Id: this.CurrentSection.Id,
      };
      for (let key of Object.keys(this.CurrentSection)) {
        if (this.ModifiedFields.includes(key)) {
          modifyRequest[key] = this.CurrentSection[key];
        }
      }
      this.storageSectionService.ApplyChangeOnRemote(modifyRequest);
      delete this.ModifiedFields;
    } else {
      this.ModifiedFields = [];
    }
  }

  public AddModifiedField(key: string) {
    if (!this.ModifiedFields.includes(key)) {
      this.ModifiedFields.push(key);
    }
  }

  public async DeleteSection() {

    let sure = await new Promise<boolean>(resolve => {
      let component = this.modalService.show(GenericTwoButtonDialogComponent);
      let dialog = component.content as GenericTwoButtonDialogComponent;
      dialog.Title = `Biztos a "${this.CurrentSection.GetDisplayName()}" nevű szekciót?`;
      dialog.Desc = 'A törölt információkat nem lehet majd visszaállítani.';
      dialog.SuccessText = 'Törlés';
      dialog.FailText = 'Mégse';
      dialog.OnCancel.subscribe(() => resolve(false));
      dialog.OnFail.subscribe(() => resolve(false));
      dialog.OnSuccess.subscribe(() => {
        resolve(true);
        });
      });
    if (sure)
      this.storageSectionService.DeleteStorageSection(this.CurrentSection.Id);
  }

  public async OnAddIngredientToSection(ingredient: IIngredient) {
    if (!this.CurrentSection.Items)
      this.CurrentSection.Items = [];
    if (this.CurrentSection.Items.find(i => i.ingredientID == ingredient.ingredientID)){
      if (!await this.ShowMergeOrCancel(ingredient)) return false;

      let item = this.CurrentSection.Items.find(i => i.ingredientID == ingredient.ingredientID);
      [item.value, item.unit] = [ingredient.value, ingredient.unit];
    }else this.CurrentSection.Items.unshift({ingredientID: ingredient.ingredientID, unit: ingredient.unit, value: ingredient.value});

    this.AddModifiedField('Items');
  }

  private async ShowMergeOrCancel(oldIngredient: IIngredient): Promise<boolean> {
    let ingredient = await this.ingredientService.GetIngredientAsync(oldIngredient.ingredientID);

    return new Promise<boolean>(async resolve => {
      let component = this.modalService.show(GenericTwoButtonDialogComponent);
      let dialog = component.content as GenericTwoButtonDialogComponent;
      dialog.Title = `Stop ütkozés!`;
      let unitName: string = (await this.unitService.GetUnitAsync(oldIngredient.unit, ingredient)).name;
      dialog.Desc = `Ebből a hozzávalóból már ${oldIngredient.value} ${unitName} van.`;
      dialog.SuccessText = 'Csere';
      dialog.FailText = 'Mégse';
      dialog.OnCancel.subscribe(() => resolve(false));
      dialog.OnFail.subscribe(() => resolve(false));
      dialog.OnSuccess.subscribe(() => {
        resolve(true);
      });
    });
  }

  public async DeleteItem(item: IIngredient) {
    this.CurrentSection.Items.splice(this.CurrentSection.Items.indexOf(item), 1);
    this.AddModifiedField('Items');
  }
}




