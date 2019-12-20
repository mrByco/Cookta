import { BrowserModule } from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';

import { AppComponent } from './app.component';
import { RootComponentComponent } from './root-component/root-component.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { FoodItemComponent } from './food/food-item/food-item.component';
import { FoodDetailComponent } from './food/food-detail/food-detail.component';
import { FoodListComponent } from './food/food-list/food-list.component';
import {MDBBootstrapModule} from "angular-bootstrap-md";

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
    MDBBootstrapModule.forRoot(),
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
