import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from "angular-bootstrap-md";
import {IdentityService} from "../../shared/services/identity.service";


@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {

  @Input() public Open: boolean;

  @ViewChild('basicModal', {static: true}) public modal: ModalDirective;

  public Callback: (loggedIn: boolean) => void;
  public RedirectUrl: string = '/';

  constructor(public identityService: IdentityService) {
  }

  ngOnInit() {
    this.identityService.OnLoginRequired.subscribe(
        (generator: { modalCallback: (loggedIn: boolean) => void, redirect: string }) => {
          this.modal.show();
          this.Callback = generator.modalCallback;
          this.RedirectUrl = generator.redirect;
        });
  }

  Cancel() {
    this.modal.hide();
    if (this.Callback) this.Callback(false);
  }
}
