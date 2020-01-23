import {EventEmitter, Injectable} from '@angular/core';
import {ServerService} from './server.service';
import {Family} from '../models/family.model';
import {Routes} from '../routes';
import {Food} from '../models/grocery/food.model';

@Injectable()
export class FamilyService {
  constructor(public serverService: ServerService) {
    this.RefreshFamilies();
  }

  public families: Family[];
  public currentFamily: Family;

  public onActiveFamilyChanged: EventEmitter<Family> = new EventEmitter<Family>();


  public async RefreshFamilies(): Promise<void>{
    return new Promise(async (resolve) => {
      let response = await this.serverService.GetRequest(Routes.User.GetUser);
      let foods: Food[] = [];
      response.subscribe(data => {
        this.currentFamily = data['ActiveFamily'] as Family;
        this.families = data['Families'] as Family[];
        this.onActiveFamilyChanged.emit(this.currentFamily);
        console.log(this.families);
        resolve();
      }, () => {
        resolve();
      });
    })
  }
}

