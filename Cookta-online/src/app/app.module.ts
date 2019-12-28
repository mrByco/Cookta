import { BrowserModule } from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';

import { AppComponent } from './app.component';
import { RootComponentComponent } from './root-component/root-component.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { FoodItemComponent } from './food/food-other/food-item/food-item.component';
import { FoodDetailComponent } from './food/food-page/food-detail/food-detail.component';
import { FoodListComponent } from './food/food-other/food-list/food-list.component';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {IdentityService} from "./shared/services/identity.service";
import {FoodService} from "./shared/services/food.service";
import {ServerService} from "./shared/services/server.service";
import {RouterModule, Routes} from "@angular/router";
import {IngredientService} from "./shared/services/ingredient.service";
import { FoodIngredientComponent } from './food/food-assemblies/food-ingredient/food-ingredient.component';
import {UnitService} from "./shared/services/unit.service";
import {AuthService} from "./shared/services/auth.service";
import {InterceptorService} from "./shared/services/interceptor.service";
import {AdsenseModule} from "ng2-adsense";
import { FoodCollectionListComponent } from './food/food-other/food-collection-list/food-collection-list.component';
import { LoginModalComponent } from './identity/login-modal/login-modal.component';
import {TagService} from "./shared/services/tag.service";
import { FoodTagComponent } from './food/food-assemblies/food-tag/food-tag.component';
import { FoodEditComponent } from './food/food-page/food-edit/food-edit.component';
import {FormsModule} from "@angular/forms";
import { IngredientAdderComponent } from './food/food-assemblies/ingredient-adder/ingredient-adder.component';
import { AutoCompleteComponent } from './utilities/auto-complete/auto-complete.component';

const appRoutes: Routes = [
  { path: '', component: FoodListComponent },
  { path: 'foods', component: FoodListComponent },
  { path: 'foods/collection', component: FoodCollectionListComponent},
  { path: 'foods/:id', component: FoodDetailComponent },
  { path: 'foods/:id/edit', component: FoodEditComponent }

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
    LoginModalComponent,
    FoodTagComponent,
    FoodEditComponent,
    IngredientAdderComponent,
    AutoCompleteComponent
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
    FormsModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [IdentityService, FoodService, ServerService, IngredientService, UnitService, AuthService, TagService],
  bootstrap: [AppComponent]
})
export class AppModule { }
