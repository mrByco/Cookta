import {Component, Input, OnInit} from '@angular/core';
import {IStorageItemChangeRequest, StorageSection} from '../../shared/models/storage/storage-section.model';
import {IIngredient} from '../../shared/models/grocery/ingredient.interface';
import {StorageService} from 'src/app/shared/services/storage.service';
import {GenericTwoButtonDialogComponent} from '../../utilities/generic-two-button-dialog/generic-two-button-dialog.component';
import {MDBModalService} from 'angular-bootstrap-md';

@Component({
  selector: 'app-storage-section',
  templateUrl: './storage-section.component.html',
  styleUrls: ['./storage-section.component.css']
})
export class StorageSectionComponent implements OnInit {

  constructor(public storageSectionService: StorageService,
              public modalService: MDBModalService) {
  }

  public ModifiedFields: string[];

  @Input() CurrentSection: StorageSection;

  @Input() public SelectedItems: IIngredient[] = [];

  public async ToggleItemSelect(item: IIngredient) {
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
      this.storageSectionService.SetStorageSectionOnRemote(modifyRequest);
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
      dialog.Title = `Biztos a "${this.CurrentSection.Name}" nevű szekciót`;
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
}
