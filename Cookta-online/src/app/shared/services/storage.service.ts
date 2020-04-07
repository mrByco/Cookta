import {Injectable} from '@angular/core';
import {ServerService} from './server.service';
import {IStorageItemChangeRequest, StorageSection} from '../models/storage/storage-section.model';
import {Routes} from '../routes';
import {Food} from '../models/grocery/food.model';
import {IIngredient} from "../models/grocery/ingredient.interface";
import {ICompleteIngredient, IngredientHelper} from "../../utilities/ingredient-helper/ingredient.helper";
import {UnitService} from "./unit.service";
import {IngredientService} from "./ingredient.service";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  public readonly Sections: StorageSection[] = [];

  public IsBusy: boolean;

  constructor(public serverService: ServerService,
              public unitService: UnitService,
              public ingredientService: IngredientService) {

  }

  public RefreshStorageSections(): Promise<void> {
    this.Sections.splice(0, this.Sections.length);

    this.IsBusy = true;

    return new Promise(async (resolve) => {
      let response = await this.serverService.GetRequest(Routes.Storage.GetSections);
      response.subscribe(data => {
        for (const d of (data as any)) {
          let section = new StorageSection();
          section = Object.assign(section, d);
          this.Sections.push(section);
        }
        resolve();
        this.IsBusy = false;
      }, () => {
        resolve();
        this.IsBusy = false;
      });
    })
  }

  public CreateStorageSection(): StorageSection{
    let createdSection = new StorageSection();

    this.IsBusy = true;
    let task = new Promise(async (resolve) => {
      let response = await this.serverService.PostRequest(Routes.Storage.CreateSection, {});
      response.subscribe(data => {
        StorageService.UpdateSection(createdSection, data);
        this.Sections.push(createdSection);
        resolve();
        this.IsBusy = false;
      }, () => {
        resolve();
        this.IsBusy = false;
      });
    });
    return createdSection;
  }

  public SetStorageSectionOnRemote(storageItemChangeRequest: IStorageItemChangeRequest): Promise<void>{
    this.IsBusy = true;

    return new Promise(async (resolve) => {
      let response = await this.serverService.PutRequest(Routes.Storage.SetSection, storageItemChangeRequest);
      response.subscribe(data => {
        StorageService.UpdateSection(this.Sections.find(i => i.Id == data['Id']), data);
        resolve();
        this.IsBusy = false;
      }, () => {
        resolve();
        this.IsBusy = false;
      });
    })
  }

  public DeleteStorageSection(sectionId: string): Promise<void>{
    this.Sections.splice(0, this.Sections.length);

    this.IsBusy = true;
    return new Promise(async (resolve) => {
      let response = await this.serverService.DeleteRequest(Routes.Storage.DeleteSection.replace('{storageSectionIdString}', sectionId));
      response.subscribe(data => {
        for (const d of (data as any)) {
          this.Sections.push(d);
        }
        this.IsBusy = false;
      }, () => {
        resolve();
        this.IsBusy = false;
      });
    })
  }

  public static UpdateSection(sectionToUpdate: StorageSection, info: any){
    for (let key of Object.keys(sectionToUpdate)){
      if (info[key])
        sectionToUpdate[key] = info[key];
    }
  }

  public AddIngredientToSection(ing: IIngredient, section: StorageSection, save?: boolean) {

    let existingSameType: IIngredient = section.Items.find(i => i.ingredientID == ing.ingredientID);

    if (existingSameType) {
      let completeExisting: ICompleteIngredient = IngredientHelper.ToCompleteIngredient(existingSameType, this.unitService, this.ingredientService);
      let completeIng: ICompleteIngredient = IngredientHelper.ToCompleteIngredient(ing, this.unitService, this.ingredientService);
      let completeAdded = IngredientHelper.Add(completeExisting, completeIng);

      section.Items[section.Items.indexOf(existingSameType)] =
        {
          ingredientID: completeAdded.ingredientType.guid,
          unit: completeAdded.unit.id,
          value: completeAdded.value,
        };
    } else
      section.Items.push(ing);

    if (save){
      this.SetStorageSectionOnRemote({Id: section.Id, Items: section.Items})
    }
  }s
}
