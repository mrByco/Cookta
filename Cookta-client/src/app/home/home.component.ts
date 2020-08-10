import {Component, OnInit} from '@angular/core';
import {AuthService} from '~/app/services/auth/auth.service';

@Component({
    selector: "Home",
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
    public authService: AuthService;

    constructor() {
        this.authService = AuthService.GetInstance();
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    logout() {
        this.authService.tnsOauthLogout().then(t => {
            this.authService.AuthToken = undefined;
            this.authService.LoggedIn = false;
            this.authService.OnLoginStateRefreshed.emit();
        });
    }
}
