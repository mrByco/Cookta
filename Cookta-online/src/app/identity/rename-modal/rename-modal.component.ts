import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ModalDirective} from "angular-bootstrap-md";

@Component({
  selector: 'app-rename-modal',
  templateUrl: './rename-modal.component.html',
  styleUrls: ['./rename-modal.component.css']
})
export class RenameModalComponent implements OnInit {

  usernameForm: FormGroup;
  @ViewChild('frame') public modal: ModalDirective;

  constructor() { }

  ngOnInit(): void {
    this.usernameForm = new FormGroup({
      usernameControl: new FormControl('', [
          Validators.maxLength(30),
          Validators.minLength(5),
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

}
