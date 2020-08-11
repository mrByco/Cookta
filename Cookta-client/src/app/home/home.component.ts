import {Component, OnInit} from '@angular/core';
import {AuthService} from '~/services/auth/auth.service';
import {RouterExtensions} from 'nativescript-angular/router'

@Component({
    selector: "Home",
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
    public authService: AuthService;

    constructor(private router: RouterExtensions) {
        this.authService = AuthService.GetInstance();
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    logout() {
        this.authService.tnsOauthLogout().then(t => {
        });
    }

    GoShoppingList() {
        this.router.navigate(['shopping'])
    }
}
