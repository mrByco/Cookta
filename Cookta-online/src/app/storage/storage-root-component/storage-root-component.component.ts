import { Component, OnInit } from '@angular/core';
import {IIngredient} from '../../shared/models/grocery/ingredient.interface';
import {StorageService} from '../../shared/services/storage.service';

@Component({
  selector: 'app-storage-root-component',
  templateUrl: './storage-root-component.component.html',
  styleUrls: ['./storage-root-component.component.scss']
})
export class StorageRootComponentComponent implements OnInit {

  public SelectedItems: IIngredient[] = [];

  constructor(public stockService: StorageService) { }

  ngOnInit() {
    console.log('Update')
    this.stockService.RefreshStorageSections();
  }

}
