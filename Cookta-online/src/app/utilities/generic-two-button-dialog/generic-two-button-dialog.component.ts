import {Component, EventEmitter, OnInit} from '@angular/core';
import {MDBModalRef} from "angular-bootstrap-md";

@Component({
  selector: 'app-generic-two-button-dialog',
  templateUrl: './generic-two-button-dialog.component.html',
  styleUrls: ['./generic-two-button-dialog.component.css']
})
export class GenericTwoButtonDialogComponent {

  constructor(public modalRef: MDBModalRef) {}

  public OnSuccess: EventEmitter<void> = new EventEmitter<void>();
  public OnFail: EventEmitter<void> = new EventEmitter<void>();
  public OnCancel: EventEmitter<void> = new EventEmitter<void>();

  public Title: string = "";
  public Desc: string = "";
  public SuccessText = "";
  public FailText = "";


  public Close(success: boolean) {
    if (success == true){
      this.OnSuccess.emit();
    }
    else if (success == false){
      this.OnFail.emit();
    }else{
      this.OnCancel.emit();
    }
    this.modalRef.hide()
  }
}
