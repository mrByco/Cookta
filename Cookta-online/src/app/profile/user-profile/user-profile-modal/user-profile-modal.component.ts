import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from "angular-bootstrap-md";
import {RenameModalComponent} from "../../../identity/rename-modal/rename-modal.component";

@Component({
  selector: 'app-user-profile-modal',
  templateUrl: './user-profile-modal.component.html',
  styleUrls: ['./user-profile-modal.component.css']
})
export class UserProfileModalComponent implements OnInit {

  @ViewChild('frame') public modal: ModalDirective;

  constructor() { }


  public Show(){
    this.modal.show();
  }
  public Hide(){
    this.modal.hide();
  }

  ngOnInit(): void {
  }

  RenameUser(SetUsernameModal: RenameModalComponent): () => void {
    return () => {
      console.log('hide')
      this.modal.hide();
      SetUsernameModal.Show();
      SetUsernameModal.modal.onHidden.subscribe(() => {
        this.modal.show();
      })
    }
  }
}
