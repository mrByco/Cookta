import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IdentityService} from '../../../shared/services/identity.service';
import {MDBModalService} from 'angular-bootstrap-md';
import {RenameModalComponent} from '../../../identity/rename-modal/rename-modal.component';
import {GenericTwoButtonDialogComponent} from '../../../utilities/generic-two-button-dialog/generic-two-button-dialog.component';
import {ConfirmDeleteModalComponent} from '../../../identity/confirm-delete-modal/confirm-delete-modal.component';

@Component({
  selector: 'app-user-profile-panel',
  templateUrl: './user-profile-panel.component.html',
  styleUrls: ['./user-profile-panel.component.css']
})
export class UserProfilePanelComponent implements OnInit {

  @Output("ModalOperationStart") onModalOperationStart = new EventEmitter();
  @Output("ModalOperationEnd") onModalOperationEnd = new EventEmitter();

  @Input("OutsideRenameModal") outRenameModal: RenameModalComponent;
  @Input("OutsideDeleteModal") outDeleteModal: ConfirmDeleteModalComponent;

  @ViewChild("SetUsernameModal") renameModal: RenameModalComponent;
  @ViewChild("DeleteModal") deleteModal: ConfirmDeleteModalComponent;

  constructor(public identityService: IdentityService, public modalService: MDBModalService) { }

  ngOnInit(): void {
  }

  async setUserName() {
    this.onModalOperationStart.emit();
    let renameComponent: RenameModalComponent = this.outRenameModal ? this.outRenameModal : this.renameModal;
    renameComponent.Show();

    renameComponent.modal.onHidden.subscribe(() => {
      this.onModalOperationEnd.emit();
    });
  }

  async deleteAccount() {
    this.onModalOperationStart.emit();

    let component = this.modalService.show(GenericTwoButtonDialogComponent);
    let dialog = component.content as GenericTwoButtonDialogComponent;

    dialog.Cancelable = true;
    dialog.Title = "Fiók törlése";
    dialog.Desc = "A fiók törlésével törölsz minden feltöltött receptet, feliratkozást, kilépsz midnen családodból. Folytatod?"
    dialog.FailText = "Törlés"
    dialog.SuccessText = "Mégsem"

    dialog.OnCancel.subscribe(() => this.onModalOperationEnd.emit())
    dialog.OnSuccess.subscribe(() => this.onModalOperationEnd.emit())
    dialog.OnFail.subscribe(() => {

      let deleteModal = this.outDeleteModal ? this.outDeleteModal : this.deleteModal;
      deleteModal.ConfirmText = this.identityService.Identity.email;
      deleteModal.OnFinished.subscribe( (res: {delete: boolean}) => {
        if (!res.delete){
          this.onModalOperationEnd.emit();
          return;
        }
        this.onModalOperationEnd.emit();
        console.log('DELETING ACCOUNT!!!!');
        location.reload();
      });
      deleteModal.Show();
    });
  }
}
