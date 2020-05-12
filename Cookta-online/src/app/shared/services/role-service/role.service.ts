import {EventEmitter, Injectable} from '@angular/core';
import {IRole} from "../../../../../../Cookta-shared/src/models/roles/role.interface";
import {ServerService} from "../server.service";

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  public roles: IRole[];

  constructor(public serverService: ServerService) { }

  public OnError = new EventEmitter<any>();

  private promisedRoles: IRole[] = [];

  public async ReloadRoles(): Promise<void> {
    this.roles = undefined;
    let response = await this.serverService.GetRequest('/role/')
    return new Promise<void>(resolve => {
      response.subscribe(data => {
        this.roles = data as IRole[];
        resolve();
      }, error => {
        console.error(error);
        this.OnError.emit({error: error});
        this.roles = null;
        resolve();
      });
    })
  }

  public GetRoleById(id: string){
    return this.roles.find(r => r.roleID == id);
  }
}
