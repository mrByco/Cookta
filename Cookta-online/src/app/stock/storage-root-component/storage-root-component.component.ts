import {Component, OnInit, ViewChild} from '@angular/core';
import {IIngredient} from '../../shared/models/grocery/ingredient.interface';
import {StorageService} from '../../shared/services/storage.service';
import {StorageSection} from '../../shared/models/storage/storage-section.model';
import {ModalDirective} from 'angular-bootstrap-md';
import {UnitService} from '../../shared/services/unit-service/unit.service';
import Fuse from "fuse.js";
import {ICompleteIngredient, IngredientHelper} from "../../utilities/ingredient-helper/ingredient.helper";
import {IngredientService} from "../../shared/services/ingredient-service/ingredient.service";

interface ISectionsSearchCache {
  section: StorageSection,
  fuse: Fuse<ICompleteIngredient>,
}

@Component({
  selector: 'app-storage-root-component',
  templateUrl: './storage-root-component.component.html',
  styleUrls: ['./storage-root-component.component.scss']
})
export class StorageRootComponentComponent implements OnInit {


  public SelectedItems: IIngredient[] = [];
  public ButtonLoading: boolean;
  public SelectedSection: StorageSection;
  public SearchResults: {section: StorageSection, ingredients: IIngredient[]}[] = [];

  private SearchCache: any = {};

@ViewChild('AddIngModal', {static: true}) public AddIngModal: ModalDirective;
  public get SearchText(){
    return this.m_SearchText;
  }
  public set SearchText(v){
    setTimeout(() => this.RefilterResults(v), 5);
    this.m_SearchText = v;
  }
  private m_SearchText: string;

  private async RefilterResults(text: string){
    if (!text) {
      this.SearchResults = []
      return;
    }
    return await new Promise(r => {
      let results: {section: StorageSection, ingredients: IIngredient[]}[] = [];
      for (let section of this.stockService.Sections){
        let cache: ISectionsSearchCache;
        if (!this.SearchCache[JSON.stringify(section)]){
          const options = {
            includeScore: true,
            keys: ['ingredientType.name'],
            threshold: 0.2,
          }
          let ingredients = IngredientHelper.ToCompleteIngredientList(section.Items, this.unitService, this.ingredientService);
          let fuse = new Fuse(ingredients, options)
          cache = this.SearchCache[JSON.stringify(section)] = {section: section, fuse: fuse};
        }else {
          cache = this.SearchCache[JSON.stringify(section)];
        }
        const foundIngredients = cache.fuse.search(text)
        if (foundIngredients.length > 0)
          results.push({section: section, ingredients: foundIngredients.map(i => IngredientHelper.ToNormalIngredient(i.item))})
      }

      this.SearchResults = text.length > 0 ? results : [];
    });
  }

  constructor(public stockService: StorageService,
              public unitService: UnitService,
              public ingredientService: IngredientService) {
    stockService.RefreshStorageSections();
  }

  async ngOnInit() {
    await this.stockService.RefreshStorageSections();
  }

  async AddNewSection() {
    this.ButtonLoading = true;
    await this.stockService.CreateStorageSection();
    this.ButtonLoading = false;
  }
  SelectedChange(){
    this.SearchText = '';
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
