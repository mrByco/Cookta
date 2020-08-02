import {Component, OnInit} from '@angular/core';
import {StorageSection} from 'src/app/shared/models/storage/storage-section.model';
import {IIngredientType} from "../../shared/models/grocery/ingredient-type.interface";
import {StorageService} from "../../shared/services/storage.service";
import {IngredientService} from "../../shared/services/ingredient-service/ingredient.service";

@Component({
  selector: 'app-stocker',
  templateUrl: './stocker.component.html',
  styleUrls: ['./stocker.component.css']
})
export class StockerComponent implements OnInit {
  Loading: boolean = false;

  public process: number = 0;
  public CheckList: {checkItems: {storage: StorageSection, ingredientType: IIngredientType}[], totalCheckCount: number};


  constructor(public storageService: StorageService, public ingredientService: IngredientService) { }

  ngOnInit(): void {
    this.CreateAndExecuteFullCheckList();
  }

  private async CreateAndExecuteFullCheckList(){
    this.Loading = true;
    let checkItems: {storage: StorageSection, ingredientType: IIngredientType}[] = [];
    await this.storageService.RefreshStorageSections();
    for (let storageSection of this.storageService.Sections){
      checkItems.push(...storageSection.Items.map(i => {return {storage: storageSection, ingredientType: this.ingredientService.GetIngredient(i.ingredientID)}}));
    }
    checkItems.push(...(await this.ingredientService.IngredientTypes)
        .filter(i => !checkItems.find(s => i.guid == s.ingredientType.guid))
        .map(i => {return {storage: undefined, ingredientType: i}}));
    this.CheckList = {checkItems: checkItems, totalCheckCount: checkItems.length}
    this.Loading = false;
  }


  GetLeftPercent() {
    return Math.floor(100 - 100 * this.CheckList.checkItems.length / this.CheckList.totalCheckCount)
  }
}
