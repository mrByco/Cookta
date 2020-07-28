import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from "angular-bootstrap-md";
import {IdentityService} from "../../shared/services/identity.service";
import {Router} from "@angular/router";


@Component({
    selector: 'app-login-modal',
    templateUrl: './login-modal.component.html',
    styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {

    @Input() public Open: boolean;

    @ViewChild('basicModal', {static: true}) public modal: ModalDirective;

    public Callback: (loggedIn: boolean) => void;

    public RedirectOnFail?: string;

    constructor(public identityService: IdentityService, public router: Router) {
        identityService.OnIdentityChanged.subscribe(i => {
            if (i) {
              this.PostLogin();
            }
        })
    }

    ngOnInit() {
        this.identityService.OnLoginRequired.subscribe(
            (generator: { modalCallback: (loggedIn: boolean) => void, options?: {redirectOnFail?: string}}) => {
                this.modal.show();
                this.Callback = generator.modalCallback;
                this.RedirectOnFail = generator.options?.redirectOnFail;
            });
    }

    Cancel() {
        this.modal.hide();
        if (this.Callback) this.Callback(false);
        if (this.RedirectOnFail) this.router.navigate([...this.RedirectOnFail.split('/')])
    }

    async Login() {
        await this.identityService.Login()
      this.PostLogin();
    }

    PostLogin() {
      if (this.Callback) {
        this.Callback(true);
      }
      this.modal.hide();
    }
}
