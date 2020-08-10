import {Component} from '@angular/core';
import {AuthService} from '~/app/services/auth/auth.service';

@Component({
    selector: 'ns-app',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    public authService: AuthService;

    private LoggedIn = false;

    constructor() {
        this.authService = AuthService.GetInstance();
        this.LoggedIn = this.authService.LoggedIn;
        this.authService.OnLoginStateRefreshed.subscribe(() => {
            this.LoggedIn = this.authService.LoggedIn;
        });
    }
}
