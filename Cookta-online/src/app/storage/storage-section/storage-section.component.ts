import {Component, Input, OnInit} from '@angular/core';
import {StorageSection} from '../../shared/models/storage/storage-section.model';
import {IIngredient} from '../../shared/models/grocery/ingredient.interface';

@Component({
  selector: 'app-storage-section',
  templateUrl: './storage-section.component.html',
  styleUrls: ['./storage-section.component.css']
})
export class StorageSectionComponent implements OnInit {

  constructor() {
    let Section = new StorageSection();
    Section.SectionName = "Hűtőszekrény";
    Section.Id = "Identifier";
    Section.SectionItems = [];
    Section.SectionItems.push({ingredientID: 'id0', unit: '', value: 0})
    Section.SectionItems.push({ingredientID: 'id1', unit: '', value: 0})
    Section.SectionItems.push({ingredientID: 'id2', unit: '', value: 0})
    Section.SectionItems.push({ingredientID: 'id3', unit: '', value: 0})
    Section.SectionItems.push({ingredientID: 'id4', unit: '', value: 0})
    Section.SectionItems.push({ingredientID: 'id5', unit: '', value: 0})
    this.CurrentSection = Section;
  }

  @Input() CurrentSection: StorageSection;

  public SelectedItems: IIngredient[] = [];
  public async ToggleItemSelect(item: IIngredient) {
    if (this.SelectedItems.includes(item)){
      this.SelectedItems.splice(this.SelectedItems.indexOf(item), 1);
    }
    else
      this.SelectedItems.push(item);
  };

  ngOnInit() {
  }

}
