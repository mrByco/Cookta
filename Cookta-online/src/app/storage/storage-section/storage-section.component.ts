import {Component, Input, OnInit} from '@angular/core';
import {IStorageItemChangeRequest, StorageSection} from '../../shared/models/storage/storage-section.model';
import {IIngredient} from '../../shared/models/grocery/ingredient.interface';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-storage-section',
  templateUrl: './storage-section.component.html',
  styleUrls: ['./storage-section.component.css']
})
export class StorageSectionComponent implements OnInit {

  constructor(public storageSectionService: StorageService) {
  }

  public ModifiedFields: string[];

  @Input() CurrentSection: StorageSection;

  @Input() public SelectedItems: IIngredient[] = [];

  public async ToggleItemSelect(item: IIngredient) {
    if (this.SelectedItems.includes(item)){
      this.SelectedItems.splice(this.SelectedItems.indexOf(item), 1);
    }
    else
      this.SelectedItems.push(item);
  };

  ngOnInit() {
  }

  public ToggleEditSection() {
    if (this.ModifiedFields){
      let modifyRequest: IStorageItemChangeRequest = {
        Id: this.CurrentSection.Id,
      };
      for (let key of Object.keys(this.CurrentSection)){
        if (this.ModifiedFields.includes(key))
          modifyRequest[key] = this.CurrentSection[key];
      }
      this.storageSectionService.SetStorageSectionOnRemote(modifyRequest);
      delete this.ModifiedFields;
    }else{
      this.ModifiedFields = [];
    }
  }

  public AddModifiedField(key: string) {
    if (!this.ModifiedFields.includes(key))
      this.ModifiedFields.push(key);
  }
}
