import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {HomeComponent} from '~/app/home/home.component';
import {HeaderComponent} from './header/header.component';
import {LoginComponent} from './identity/login/login.component';
import {LoadingComponent} from './loading/loading.component';
import {CommonModule} from '@angular/common';
import {NativeScriptModule, NativeScriptHttpClientModule} from 'nativescript-angular'
import { ShoppingListComponent } from './shopping/shopping-list/shopping-list.component';
import { ShoppingListPanelComponent } from './shopping/shopping-list-panel/shopping-list-panel.component';
import {ShoppingService} from '~/services/shopping/shopping.service';
import {ServerService} from '~/services/server/server.service';


@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        CommonModule
    ],
    declarations: [
        NativeScriptModule,
        NativeScriptHttpClientModule,
        AppComponent,
        HomeComponent,
        HeaderComponent,
        LoginComponent,
        LoadingComponent,
        ShoppingListComponent,
        ShoppingListPanelComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [ShoppingService, ServerService]
})
export class AppModule {
}
