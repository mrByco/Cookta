import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ModalDirective} from "angular-bootstrap-md";
import {IdentityService} from '../../shared/services/identity.service';

@Component({
  selector: 'app-rename-modal',
  templateUrl: './rename-modal.component.html',
  styleUrls: ['./rename-modal.component.css']
})
export class RenameModalComponent implements OnInit {

  usernameForm: FormGroup;
  @ViewChild('frame') public modal: ModalDirective;


  public Loading: boolean = false;


  constructor(public identityService: IdentityService) { }

  ngOnInit(): void {
    this.usernameForm = new FormGroup({
      usernameControl: new FormControl('', [
          Validators.maxLength(30),
          Validators.minLength(4),
          Validators.pattern('^[^< >]+$'),
          Validators.required,
      ])
    })
  }

  public Show(){
    this.modal.show();
  }
  public Hide(){
    this.modal.hide();
  }


  get renameUser() {
    return this.usernameForm.get('usernameControl');
  }

  public async ProcessUsername(){
    this.Loading = true;
    try {
      await this.identityService.ChangeUsername(this.renameUser.value);
    }finally {
      this.modal.hide();
      this.Loading = false;
    }
  }

}
