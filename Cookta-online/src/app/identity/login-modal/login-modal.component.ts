import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MDBModalRef, ModalDirective} from "angular-bootstrap-md";
import {IdentityService} from "../../shared/services/identity.service";
import {Router} from "@angular/router";


@Component({
    selector: 'app-login-modal',
    templateUrl: './login-modal.component.html',
    styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent {

    @Input() public Open: boolean;


    public Callback: (loggedIn: boolean) => void;

    public RedirectOnFail?: string;

    public static redirectUrl: string = undefined;

    constructor(public router: Router, public modalRef: MDBModalRef) {

    }


    Cancel() {
        this.modalRef.hide();
        if (this.Callback) this.Callback(false);
        if (this.RedirectOnFail) this.router.navigate([...this.RedirectOnFail.split('/')])
    }

    Login() {
        IdentityService.Instance.Login(LoginModalComponent.redirectUrl);
    }

}
