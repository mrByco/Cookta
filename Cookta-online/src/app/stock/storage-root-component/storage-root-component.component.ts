import { Component, OnInit } from '@angular/core';
import {IIngredient} from '../../shared/models/grocery/ingredient.interface';
import {StorageService} from '../../shared/services/storage.service';
import {StorageSection} from "../../shared/models/storage/storage-section.model";

@Component({
  selector: 'app-storage-root-component',
  templateUrl: './storage-root-component.component.html',
  styleUrls: ['./storage-root-component.component.scss']
})
export class StorageRootComponentComponent implements OnInit {



  public SelectedItems: IIngredient[] = [];
  public ButtonLoading: boolean;
  SelectedSection: StorageSection;

  constructor(public stockService: StorageService) { }

  async ngOnInit() {
    console.log('Update')
    await this.stockService.RefreshStorageSections();
  }

  async AddNewSection() {
    this.ButtonLoading = true;
    await this.stockService.CreateStorageSection();
    this.ButtonLoading = false;
  }
}
