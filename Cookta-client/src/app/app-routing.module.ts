import {NgModule} from '@angular/core';
import {Routes} from '@angular/router';
import {NativeScriptRouterModule} from 'nativescript-angular/router';
import {HomeComponent} from '~/app/home/home.component';

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    {path: 'home', component: HomeComponent}
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    providers: [],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {

    constructor() {
    }
}
