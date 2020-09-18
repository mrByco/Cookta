import {SwUpdate} from '@angular/service-worker';
import {interval} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: "root"
})
export class UpdateService {

    constructor(public updates: SwUpdate) {
        if (updates.isEnabled) {
            interval(20 * 60 * 1000).subscribe(() => updates.checkForUpdate()
                .then(() => console.log('Checking for updates..2')));
        }
    }

    public checkForUpdates(): void {
        this.updates.available.subscribe(event => this.promptUser());
    }

    private promptUser(): void {
        console.log('Új verzió elérhető, alkalmazás frissítése');
        this.updates.activateUpdate().then(() => document.location.reload());
    }
}
