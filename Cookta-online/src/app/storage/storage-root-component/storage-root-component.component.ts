import { Component, OnInit } from '@angular/core';
import {IIngredient} from '../../shared/models/grocery/ingredient.interface';

@Component({
  selector: 'app-storage-root-component',
  templateUrl: './storage-root-component.component.html',
  styleUrls: ['./storage-root-component.component.scss']
})
export class StorageRootComponentComponent implements OnInit {

  public SelectedItems: IIngredient[] = [];

  constructor() { }

  ngOnInit() {
  }

}
