import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {IIngredient} from '../../shared/models/grocery/ingredient.interface';
import {StorageService} from '../../shared/services/storage.service';
import {StorageSection} from '../../shared/models/storage/storage-section.model';
import {ModalDirective} from 'angular-bootstrap-md';
import {IIngredientType} from '../../shared/models/grocery/ingredient-type.interface';
import {IngredientType} from '../../shared/models/grocery/ingredient-type.model';
import {UnitService} from '../../shared/services/unit.service';

@Component({
  selector: 'app-storage-root-component',
  templateUrl: './storage-root-component.component.html',
  styleUrls: ['./storage-root-component.component.scss']
})
export class StorageRootComponentComponent implements OnInit {


  public SelectedItems: IIngredient[] = [];
  public ButtonLoading: boolean;
  public SelectedSection: StorageSection;

  @ViewChild('AddIngModal', {static: true}) public AddIngModal: ModalDirective;

  constructor(public stockService: StorageService,
              public unitService: UnitService) {
  }

  async ngOnInit() {
    await this.stockService.RefreshStorageSections();
  }

  async AddNewSection() {
    this.ButtonLoading = true;
    await this.stockService.CreateStorageSection();
    this.ButtonLoading = false;
  }

  AddIngredientToSection(ingredient) {
    this.stockService.AddIngredientToSection(ingredient, this.SelectedSection, true);
  }

  public ShowAddModal() {
    if (this.stockService.Sections.length > 0) {
      this.SelectedSection = this.stockService.Sections[0];
    } else {
      this.SelectedSection = this.stockService.CreateStorageSection();
    }

    this.AddIngModal.show();
  }

  public findStorageSectionsByType(typeId: string): StorageSection[] {
    return this.stockService.FindStoragesByIngredientType(typeId);
  }

  CloseIfIngredientIsZero(ingredient: IIngredient, removeIngModal: ModalDirective) {
    if (ingredient.value <= 0){
      removeIngModal.hide();
    }
  }
}
