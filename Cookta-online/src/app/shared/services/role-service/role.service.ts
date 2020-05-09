import { Injectable } from '@angular/core';
import {IRole} from "../../../../../../Cookta-shared/src/models/roles/role.interface";
import {ServerService} from "../server.service";

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  public roles: IRole[] = null;

  constructor(public serverService: ServerService) { }

  public async ReloadRoles(): Promise<void> {
  }
}
