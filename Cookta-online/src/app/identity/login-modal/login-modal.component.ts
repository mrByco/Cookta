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

  constructor(public identityService: IdentityService) {
      console.log('subscribed');
  }

  ngOnInit() {
    this.identityService.OnLoginRequired.subscribe(
        (generator: { modalCallback: (loggedIn: boolean) => void }) => {
          this.modal.show();
          this.Callback = generator.modalCallback;
        });
    console.log('subscribed');
  }

  Cancel() {
    this.modal.hide();
    if (this.Callback) this.Callback(false);
  }

    async Login() {
      await this.identityService.Login()
        if (this.Callback){
            this.Callback(true);
        }
        this.modal.hide();
    }
}
