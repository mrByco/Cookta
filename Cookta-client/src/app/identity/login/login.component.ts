import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from '~/services/auth/auth.service';
import {RouterExtensions} from 'nativescript-angular/router';

@Component({
    selector: 'ns-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    public authService: AuthService;

    constructor(public routerExtensions: RouterExtensions, private changeDetectorRef: ChangeDetectorRef) {
        this.authService = AuthService.GetInstance();
    }

    ngOnInit(): void {
    }

    async LoginWithGoogle() {
        await this.authService
            .tnsOauthLogin('google')
            .then(t => {
            });
    }

    Into() {
        console.log(this.authService.LoggedIn);
    }
}
