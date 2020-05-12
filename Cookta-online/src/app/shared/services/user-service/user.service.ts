import { Injectable } from '@angular/core';
import {ExtendedUser} from "../../../../../../Cookta-shared/src/models/user/extendedUser";
import {ServerService} from "../server.service";
import {Routes} from "../../routes";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public Users: ExtendedUser[];

  constructor(public serverService: ServerService) { }



  async ReloadUsers(): Promise<void> {
    this.Users = undefined;
    let response = await this.serverService.GetRequest(Routes.User.GetAll);
    return new Promise(resolve => {
      response.subscribe((s) => {
        this.Users = s as ExtendedUser[];
        console.log(this.Users)
        resolve();
      }, (e) => {
        this.Users = null;
        console.error(e);
        resolve();
      });
    });
  }

}
