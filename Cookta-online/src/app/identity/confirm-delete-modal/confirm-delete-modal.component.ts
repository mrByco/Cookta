import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from 'angular-bootstrap-md';

@Component({
  selector: 'app-confirm-delete-modal',
  templateUrl: './confirm-delete-modal.component.html',
  styleUrls: ['./confirm-delete-modal.component.css']
})
export class ConfirmDeleteModalComponent implements OnInit {


  get deleteUser() {
    return this.usernameForm.get('usernameControl');
  }
  usernameForm: FormGroup;
  @ViewChild('frame') public modal: ModalDirective;
  @Output() OnFinished: EventEmitter<{ delete: boolean }> = new EventEmitter<{ delete: boolean }>();
  public ConfirmText: string = "S4MN1";

  constructor() {
  }

  ngOnInit(): void {
    this.usernameForm = new FormGroup({
      usernameControl: new FormControl('', [
        (control) => {return control.value == this.ConfirmText ? null : [{key: 'match'}]}
      ])
    });
  }


  public Show() {
    this.modal.show();
    console.log(this.usernameForm.controls);
  }

  public Hide() {
    this.modal.hide();
  }

  Cancel() {
    this.modal.hide();
    this.OnFinished.emit({delete: false});
  }


}
