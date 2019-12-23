import { BrowserModule } from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';

import { AppComponent } from './app.component';
import { RootComponentComponent } from './root-component/root-component.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { FoodItemComponent } from './food/food-item/food-item.component';
import { FoodDetailComponent } from './food/food-detail/food-detail.component';
import { FoodListComponent } from './food/food-list/food-list.component';
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {IdentityService} from "./shared/services/identity.service";
import {FoodService} from "./shared/services/food.service";
import {HttpClientModule} from "@angular/common/http";
import {ServerService} from "./shared/models/grocery/server.service";
import {Router, RouterModule, Routes} from "@angular/router";

const appRoutes: Routes = [
  { path: '', component: FoodListComponent },
  { path: 'foods', component: FoodListComponent },
  { path: 'foods/:id', component: FoodDetailComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    RootComponentComponent,
    NavigationBarComponent,
    FoodItemComponent,
    FoodDetailComponent,
    FoodListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    RouterModule.forRoot(appRoutes)
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [IdentityService, FoodService, ServerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
