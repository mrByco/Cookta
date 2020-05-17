import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../shared/services/user-service/user.service";
import {ExtendedUser} from "../../../../../Cookta-shared/src/models/user/extendedUser";
import { RoleService } from 'src/app/shared/services/role-service/role.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  SelectedUser: ExtendedUser;

  @ViewChild(HTMLSelectElement) public select: HTMLSelectElement;

  constructor(public userService: UserService, public roleService: RoleService) {

  }

  ngOnInit(): void {
    this.userService.ReloadUsers();
    this.roleService.ReloadRoles();
  }


  SelectUser(user: ExtendedUser) {
    this.SelectedUser = user;
  }

  GetCurrentRoleIndex() {
    return this.roleService.roles.findIndex(r => r.roleID == this.SelectedUser.role);
  }

  OnRoleChange(e) {
    this.userService.ChangeUserRole(this.SelectedUser.sub, e);
  };
}
