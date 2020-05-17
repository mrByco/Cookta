import { Component, OnInit } from '@angular/core';
import {RoleService} from "../../../shared/services/role-service/role.service";
import {IRole} from "../../../../../../Cookta-shared/src/models/roles/role.interface";

@Component({
  selector: 'app-role-editor',
  templateUrl: './role-editor.component.html',
  styleUrls: ['./role-editor.component.css']
})
export class RoleEditorComponent implements OnInit {

  public SelectedRole: IRole;

  

  constructor(public roleService: RoleService) { }

  async ngOnInit(): Promise<void> {
    await this.roleService.ReloadRoles();
  }

  SelectRole(role: IRole) {
    this.SelectedRole = role;
  }
}
