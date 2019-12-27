import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MDBModalRef, ModalDirective} from "angular-bootstrap-md";
import {IdentityService} from "../../shared/services/identity.service";
import {identity} from "rxjs";


@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {

  @Input() public Open: boolean;

  @ViewChild('basicModal', {static: true}) public modal: ModalDirective;

  constructor(public identityService: IdentityService) { }

  ngOnInit() {
    this.identityService.OnLoginRequired.subscribe( () => {
      this.modal.show();
    });
  }
}
