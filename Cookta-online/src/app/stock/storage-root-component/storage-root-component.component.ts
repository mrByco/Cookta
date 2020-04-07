import {Component, OnInit, ViewChild} from '@angular/core';
import {IIngredient} from '../../shared/models/grocery/ingredient.interface';
import {StorageService} from '../../shared/services/storage.service';
import {StorageSection} from "../../shared/models/storage/storage-section.model";
import {ModalDirective} from "angular-bootstrap-md";

@Component({
  selector: 'app-storage-root-component',
  templateUrl: './storage-root-component.component.html',
  styleUrls: ['./storage-root-component.component.scss']
})
export class StorageRootComponentComponent implements OnInit {


  public SelectedItems: IIngredient[] = [];
  public ButtonLoading: boolean;
  public SelectedSection: StorageSection;

  @ViewChild("AddIngModal", {static: true}) public AddIngModal: ModalDirective;

  constructor(public stockService: StorageService) {
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
    console.log(ingredient);
    this.stockService.AddIngredientToSection(ingredient, this.SelectedSection, true);
  }

  public ShowModal() {
    if (this.stockService.Sections.length > 0)
      this.SelectedSection = this.stockService.Sections[0];
     else
      this.SelectedSection = this.stockService.CreateStorageSection();

    this.AddIngModal.show();
  }
}
