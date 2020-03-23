import {Injectable} from '@angular/core';
import {ServerService} from './server.service';
import {IStorageItemChangeRequest, StorageSection} from '../models/storage/storage-section.model';
import {Routes} from '../routes';
import {Food} from '../models/grocery/food.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  public readonly Sections: StorageSection[] = [];

  constructor(public serverService: ServerService) {

  }

  public RefreshStorageSections(): Promise<void> {
    this.Sections.splice(0, this.Sections.length);

    return new Promise(async (resolve) => {
      let response = await this.serverService.GetRequest(Routes.Storage.GetSections);
      response.subscribe(data => {
        for (const d of (data as any)) {
          this.Sections.push(d);
        }
        resolve();
      }, () => {
        resolve();
      });
    })
  }

  public CreateStorageSection(): Promise<void>{
    let createdSection = new StorageSection();

    return new Promise(async (resolve) => {
      let response = await this.serverService.PostRequest(Routes.Storage.CreateSection, {});
      response.subscribe(data => {
        StorageService.UpdateSection(createdSection, data);
        this.Sections.push(createdSection);
        resolve();
      }, () => {
        resolve();
      });
    })
  }

  public SetStorageSectionOnRemote(storageItemChangeRequest: IStorageItemChangeRequest): Promise<void>{

    return new Promise(async (resolve) => {
      let response = await this.serverService.PutRequest(Routes.Storage.SetSection, storageItemChangeRequest);
      response.subscribe(data => {
        StorageService.UpdateSection(this.Sections.find(i => i.Id == data['Id']), data);
        resolve();
      }, () => {
        resolve();
      });
    })
  }

  public DeleteStorageSection(sectionId: string): Promise<void>{
    this.Sections.splice(0, this.Sections.length);

    return new Promise(async (resolve) => {
      let response = await this.serverService.DeleteRequest(Routes.Storage.DeleteSection.replace('{storageSectionIdString}', sectionId));
      response.subscribe(data => {
        for (const d of (data as any)) {
          this.Sections.push(d);
        }
      }, () => {
        resolve();
      });
    })
  }

  public static UpdateSection(sectionToUpdate: StorageSection, info: any){
    for (let key of Object.keys(sectionToUpdate)){
      if (info[key])
        sectionToUpdate[key] = info[key];
    }
  }
}
