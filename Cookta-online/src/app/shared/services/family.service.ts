import {EventEmitter, Injectable} from '@angular/core';
import {ServerService} from './server.service';
import {EFamilyRole, Family} from '../models/family.model';
import {Routes} from '../routes';
import {Food} from '../models/grocery/food.model';
import {IdentityService} from './identity.service';

@Injectable()
export class FamilyService {
  constructor(public serverService: ServerService, public identityService: IdentityService) {
    this.RefreshFamilies();
  }

  public families: Family[] = [];
  public currentFamily: Family;

  public GetOwnFamilies(): Family[] {
    return this.families.filter(f => f.members.find
    (u => u.sub == this.identityService.LastKnownUserInfo.sub)
      .role == EFamilyRole.owner);
  }

  public GetOtherFamilies(): Family[] {
    return this.families.filter(f => f.members.find
    (u => u.sub == this.identityService.LastKnownUserInfo.sub)
      .role != EFamilyRole.owner);
  }

  public onActiveFamilyChanged: EventEmitter<Family> = new EventEmitter<Family>();
  public onFamiliesChanged: EventEmitter<Family[]> = new EventEmitter<Family[]>();


  public async RefreshFamilies(): Promise<void> {
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
    });
  }

  public async CreateFamily(name: string): Promise<Family> {
    return new Promise(async (resolve) => {
      let response = await this.serverService.PostRequest(Routes.Family.CreateFamily.replace('{familyName}', name), {});
      response.subscribe(data => {
        let newFamily = data as Family;

        this.families.push(newFamily);
        this.currentFamily = newFamily;

        this.onActiveFamilyChanged.emit(this.currentFamily);
        this.onFamiliesChanged.emit(this.families);
        resolve(newFamily);
      }, () => {
        resolve();
      });
    });
  }
}

