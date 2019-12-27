import { BrowserModule } from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';

import { AppComponent } from './app.component';
import { RootComponentComponent } from './root-component/root-component.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { FoodItemComponent } from './food/food-item/food-item.component';
import { FoodDetailComponent } from './food/food-detail/food-detail.component';
import { FoodListComponent } from './food/food-list/food-list.component';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {IdentityService} from "./shared/services/identity.service";
import {FoodService} from "./shared/services/food.service";
import {ServerService} from "./shared/services/server.service";
import {RouterModule, Routes} from "@angular/router";
import {IngredientService} from "./shared/services/ingredient.service";
import { FoodIngredientComponent } from './food/food-ingredient/food-ingredient.component';
import {UnitService} from "./shared/services/unit.service";
import {AuthService} from "./shared/services/auth.service";
import {InterceptorService} from "./shared/services/interceptor.service";
import {AdsenseModule} from "ng2-adsense";
import { FoodCollectionListComponent } from './food/food-collection-list/food-collection-list.component';
import { LoginModalComponent } from './identity/login-modal/login-modal.component';

const appRoutes: Routes = [
  { path: '', component: FoodListComponent },
  { path: 'foods', component: FoodListComponent,
    children: [
    ]},

  { path: 'foods/collection', component: FoodCollectionListComponent},
  { path: 'foods/:id', component: FoodDetailComponent }
  ];

@NgModule({
  declarations: [
    AppComponent,
    RootComponentComponent,
    NavigationBarComponent,
    FoodItemComponent,
    FoodDetailComponent,
    FoodListComponent,
    FoodIngredientComponent,
    FoodCollectionListComponent,
    LoginModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    AdsenseModule.forRoot({
      adClient: 'ca-pub-8068476996237937',
      adSlot: 1393101782,
    }),
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [IdentityService, FoodService, ServerService, IngredientService, UnitService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
