import {EventEmitter, Injectable} from '@angular/core';
import {ServerService} from './server.service';
import {IStorageItemChangeRequest, StorageSection} from '../models/storage/storage-section.model';
import {Routes} from '../routes';
import {IIngredient} from '../models/grocery/ingredient.interface';
import {ICompleteIngredient, IngredientHelper} from '../../utilities/ingredient-helper/ingredient.helper';
import {UnitService} from './unit-service/unit.service';
import {IngredientService} from './ingredient-service/ingredient.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  public readonly Sections: StorageSection[] = [];
  public readonly OnSecrionsRefreshed = new EventEmitter<StorageSection[]>();

  public IsBusy: boolean;

  constructor(public serverService: ServerService,
              public unitService: UnitService,
              public ingredientService: IngredientService) {
    this.RefreshStorageSections();
    setInterval(() => this.RefreshStorageSections(), 30 * 60 * 1000);
  }

  private static SectionFromData(d: any): StorageSection {
    let section = new StorageSection();
    section = Object.assign(section, d);
    return section;
  }

  public GetStorageSection(id: string): StorageSection{
    return this.Sections.find(i => i.Id == id);
  }

  public RefreshStorageSections(): Promise<void> {
    this.Sections.splice(0, this.Sections.length);

    this.IsBusy = true;

    return new Promise(async (resolve) => {
      let response = await this.serverService.GetRequest(Routes.Storage.GetSections);
      response.subscribe(data => {
        this.Sections.splice(0, this.Sections.length);
        for (const d of (data as any)) {
          this.Sections.push(StorageService.SectionFromData(d));
        }
        this.OnSecrionsRefreshed.emit(this.Sections);
        resolve();
        this.IsBusy = false;
      }, () => {
        resolve();
        this.IsBusy = false;
      });
    });
  }

  public ApplyChangeOnRemote(storageItemChangeRequest: IStorageItemChangeRequest): Promise<void> {
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
    });
  }

  public CreateStorageSection(): StorageSection {
    let createdSection = new StorageSection();

    this.IsBusy = true;
    new Promise(async (resolve) => {
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

  public static UpdateSection(sectionToUpdate: StorageSection, info: any) {
    for (let key of Object.keys(sectionToUpdate)) {
      if (info[key]) {
        sectionToUpdate[key] = info[key];
      }
    }
  }

  public AddIngredientToSection(ing: IIngredient, section: StorageSection, save?: boolean) {

    if (!section.Items) {
      section.Items = [];
    }
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
    } else {
      section.Items.push(ing);
    }

    if (save) {
      this.ApplyChangeOnRemote({Id: section.Id, Items: section.Items});
    }
  }

  //returns the remnant
  public SubtractIngredientFromSection(ing: IIngredient, section: StorageSection, save?: boolean): IIngredient {

    if (!section.Items) {
      return ing;
    }
    let existing: IIngredient = section.Items.find(i => i.ingredientID == ing.ingredientID);
    if (!existing) {
      return ing;
    }

    let existComplete: ICompleteIngredient = IngredientHelper.ToCompleteIngredient(existing, this.unitService, this.ingredientService);

    let completeToSubtract: ICompleteIngredient = IngredientHelper.ToCompleteIngredient(ing, this.unitService, this.ingredientService);
    console.log(existComplete);
    console.log(completeToSubtract);

    IngredientHelper.Subtract(existComplete, completeToSubtract);

    console.log(existComplete);
    console.log(completeToSubtract);

    section.Items[section.Items.indexOf(existing)] =
      {
        ingredientID: existComplete.ingredientType.guid,
        unit: existComplete.unit.id,
        value: existComplete.value,
      };

    if (save) {
      this.ApplyChangeOnRemote({Id: section.Id, Items: section.Items});
    }
    return {ingredientID: completeToSubtract.ingredientType.guid, unit: completeToSubtract.unit.id, value: completeToSubtract.value}
  }

  public FindStorageByIngredientType(ingredientId: string) {
    return this.Sections.find(s => s.Items ? s.Items.find((s) => s.ingredientID == ingredientId) : false);
  }

  public FindStoragesByIngredientType(ingredientId: string): StorageSection[] {
    return this.Sections.filter(s => s.Items ? s.Items.find((s) => s.ingredientID == ingredientId) : false);
  }

  public DeleteStorageSection(sectionId: string): Promise<void> {
    this.Sections.splice(0, this.Sections.length);

    this.IsBusy = true;
    return new Promise(async (resolve) => {
      let response = await this.serverService.DeleteRequest(Routes.Storage.DeleteSection.replace('{storageSectionIdString}', sectionId));
      response.subscribe(data => {
        for (const d of (data as any)) {
          this.Sections.push(StorageService.SectionFromData(d));
        }
        this.IsBusy = false;
      }, () => {
        resolve();
        this.IsBusy = false;
      });
    });
  }
}
