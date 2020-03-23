import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {EFamilyRole, Family} from '../../../shared/models/family.model';
import {FamilyService} from '../../../shared/services/family.service';
import {IdentityService} from '../../../shared/services/identity.service';
import {MDBModalRef, ModalDirective} from 'angular-bootstrap-md';

@Component({
  selector: 'app-family-details-page',
  templateUrl: './family-details-page.component.html',
  styleUrls:
    ['./family-details-page.component.css',
      '../family-management/family-management.component.css']
})
export class FamilyDetailsPageComponent implements OnInit {
  @Input() CurrentFamily: Family;
  @Input() Loading: boolean;
  @Input() Editing: boolean;

  @ViewChild('modalDirective', {static: true}) AddModal: ModalDirective ;
  private AddUsername: string;
  private AddEmail: string;

  private RoleToString: (role: EFamilyRole) => string = Family.FamilyRoleToString;

  constructor(private familyService: FamilyService, private identityService: IdentityService) {
  }

  ngOnInit() {
  }

  ShowAddMemberDialog() {

  }

  SetEditing(b: boolean) {
    this.Editing = b;
  }

  GetShowDeleteButton(): boolean {
    return this.CurrentFamily.members.find(m => (m.role == EFamilyRole.owner && m.sub == this.identityService.Identity.sub)) != null;
  }

  GetShowLeaveButton(): boolean {
    return this.CurrentFamily.members.find(m => (m.role == EFamilyRole.owner && m.sub == this.identityService.Identity.sub)) == null;
  }

  GetShowEditButton(): boolean {
    return false;
    return this.CurrentFamily.members.find(m => (m.role == EFamilyRole.owner && m.sub == this.identityService.Identity.sub)) != null;
  }

  CloseModal() {
    this.AddModal.hide();
    this.AddUsername = "";
    this.AddEmail = "";
  }

  async AddUserToFamily() {
    this.Loading = true;
    let task = this.familyService.InviteMemberToFamily(this.CurrentFamily, {invitedEmail: this.AddEmail, invitedUsername: this.AddUsername});
    this.CloseModal();
    await task;
    this.Loading = false;
  }

  DeleteFamily() {
    this.familyService.DeleteFamily(this.CurrentFamily);
    this.CurrentFamily = null;
  }
}
