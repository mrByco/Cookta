import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {NativeScriptModule} from 'nativescript-angular/nativescript.module';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {HomeComponent} from '~/app/home/home.component';
import {HeaderComponent} from './header/header.component';
import {LoginComponent} from './identity/login/login.component';
import {LoadingComponent} from './loading/loading.component';
import {CommonModule} from '@angular/common';


@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        CommonModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        HeaderComponent,
        LoginComponent,
        LoadingComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: []
})
export class AppModule {
}
