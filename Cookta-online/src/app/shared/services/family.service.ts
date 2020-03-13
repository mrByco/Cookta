import {EventEmitter, Injectable} from '@angular/core';
import {ServerService} from './server.service';
import {EFamilyRole, Family, IFamilyMember} from '../models/family.model';
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
    if (!this.families) return [];
    return this.families.filter
    (f => f.members.find(member => this.identityService.Identity.subs.includes(member.sub)).role == EFamilyRole.owner);
  }

  public GetOtherFamilies(): Family[] {
    if (!this.families) return [];
    return this.families.filter(f => f.members.find(member => this.identityService.Identity.subs.includes(member.sub)).role != EFamilyRole.owner);
  }

  public onActiveFamilyChanged: EventEmitter<Family> = new EventEmitter<Family>();
  public onFamiliesChanged: EventEmitter<Family[]> = new EventEmitter<Family[]>();


  public async RefreshFamilies(data?: any): Promise<void> {
    data = data ? data : await new Promise(async (resolve) => {
      let response = await this.serverService.GetRequest(Routes.User.GetUser);
      let foods: Food[] = [];
      response.subscribe(data => {
        resolve(data);
      }, () => {
        resolve();
      });
    });

    this.currentFamily = data['ActiveFamily'] as Family;
    this.families = data['Families'] as Family[];
    this.onActiveFamilyChanged.emit(this.currentFamily);
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

  public async SwitchFamily(family: Family): Promise<Family> {
    return new Promise(async (resolve) => {
      let response = await this.serverService.PutRequest(Routes.Family.SwitchFamily.replace('{newId}', family.id), {});
      response.subscribe(data => {
        let newFamily = data as Family;
        this.currentFamily = newFamily;

        this.onActiveFamilyChanged.emit(this.currentFamily);
        resolve(newFamily);
        location = location;
      }, () => {
        resolve();
      });
    });
  }

  public async RemoveFromFamily(currentFamily: Family, member?: IFamilyMember): Promise<Family>{
    return new Promise(async (resolve) => {
      let response = await this.serverService.DeleteRequest(Routes.Family.KickUserFromFamily
        .replace('{familyId}', currentFamily.id)
        .replace('{removeUserSub}', member ? member.sub : this.identityService.LastKnownUserInfo.sub));

      response.subscribe(data => {
        let newFamily = data as Family;


        currentFamily.members = newFamily.members;
        currentFamily.name = newFamily.name;

        this.onActiveFamilyChanged.emit(this.currentFamily);
        resolve(newFamily);
      }, () => {
        resolve();
      });
    });
  }
  public async InviteMemberToFamily(family: Family, request: {invitedUsername: string, invitedEmail: string}): Promise<Family>{
    return new Promise(async (resolve) => {
      let response = await this.serverService.PutRequest(Routes.Family.InviteToFamily
        .replace('{familyId}', family.id), request);

      response.subscribe(data => {

        if (data == null || data == ''){
          resolve(family);
          return;
        }
        let newFamily = data as Family;

        family.name = newFamily.name;
        family.members = newFamily.members;

        resolve(family);
      }, () => {
        resolve();
      });
    });
  }

  public async DeleteFamily(family: Family){
    delete this.families[this.families.indexOf(family)];
    return new Promise(async (resolve) => {
      let response = await this.serverService.DeleteRequest(Routes.Family.DeleteFamily
        .replace('{deleteId}', family.id));

      response.subscribe(data => {
        let newFamily = data as Family;
        let needReload = family.id == this.currentFamily.id;
        let existing = this.families.find(f => f.id == newFamily.id);
        if (existing){
          existing.name = newFamily.name;
          existing.members = newFamily.members;
          this.currentFamily = existing;
        }else{
          this.families.push(newFamily);
          this.currentFamily = newFamily;
        }
        this.onFamiliesChanged.emit(this.families);
        this.onActiveFamilyChanged.emit(this.currentFamily);
        if (needReload)
          location = location;
        resolve(newFamily);
      }, () => {
        resolve();
      });
    });
  }
}

