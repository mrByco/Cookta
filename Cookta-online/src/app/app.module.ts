import {BrowserModule} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';

import {AppComponent} from './app.component';
import {RootComponentComponent} from './root-component/root-component.component';
import {NavigationBarComponent} from './navigation-bar/navigation-bar.component';
import {FoodItemComponent} from './food/food-other/food-item/food-item.component';
import {FoodDetailComponent} from './food/food-page/food-detail/food-detail.component';
import {FoodListComponent} from './food/food-other/food-list/food-list.component';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {HttpClientModule} from "@angular/common/http";
import {IdentityService} from "./shared/services/identity.service";
import {FoodService} from "./shared/services/food.service";
import {ServerService} from "./shared/services/server.service";
import {RouterModule, Routes} from "@angular/router";
import {IngredientService} from "./shared/services/ingredient.service";
import {FoodIngredientComponent} from './food/food-assemblies/food-ingredient/food-ingredient.component';
import {UnitService} from "./shared/services/unit.service";
import {AuthService} from "./shared/services/auth.service";
import {AdsenseModule} from "ng2-adsense";
import {FoodCollectionListComponent} from './food/food-other/food-collection-list/food-collection-list.component';
import {LoginModalComponent} from './identity/login-modal/login-modal.component';
import {TagService} from "./shared/services/tag.service";
import {FoodTagComponent} from './food/food-assemblies/food-tag/food-tag.component';
import {FoodEditComponent} from './food/food-page/food-edit/food-edit.component';
import {FormsModule} from "@angular/forms";
import {IngredientAdderComponent} from './food/food-assemblies/ingredient-adder/ingredient-adder.component';
import {AutoCompleteComponent} from './utilities/auto-complete/auto-complete.component';
import {TagAdderComponent} from './food/food-assemblies/tag-adder/tag-adder.component';
import {IngredientEditorComponent} from './admin-components/ingredient-editor/ingredient-editor.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {IngredientItemPopupComponent} from './admin-components/ingredient-editor/ingredient-item-popup/ingredient-item-popup.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {GenericTwoButtonDialogComponent} from './utilities/generic-two-button-dialog/generic-two-button-dialog.component';
import {CanDeactivateGuard} from "./guards/can-deactivate-guard";
import {FoodImageUploadComponent} from './food/food-assemblies/food-image-upload/food-image-upload.component';
import {ImageCropperModule} from "ngx-image-cropper";
import {FamilyService} from './shared/services/family.service';
import { MenuEditorComponent } from './menu/menu-editor/menu-editor.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { FoodPoolComponent } from './food/food-other/food-pool/food-pool.component';
import { MenuDayComponent } from './menu/menu-day/menu-day.component';
import { MenuMealingComponent } from './menu/menu-mealing/menu-mealing.component';
import {MealingService} from "./shared/services/mealing.service";
import { TagPoolComponent } from './menu/tag-pool/tag-pool.component';

const appRoutes: Routes = [
  {path: '', component: FoodListComponent},
  {path: 'foods', component: FoodListComponent},
  {path: 'ingredient-editor', component: IngredientEditorComponent},
  {path: 'foods/collection', component: FoodCollectionListComponent},
  {path: 'foods/:id', component: FoodDetailComponent},
  {path: 'foods/:id/edit', component: FoodEditComponent, canDeactivate: [CanDeactivateGuard]},
  {path: 'calendar', component: MenuEditorComponent}

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
    AutoCompleteComponent,
    TagAdderComponent,
    IngredientEditorComponent,
    IngredientItemPopupComponent,
    GenericTwoButtonDialogComponent,
    FoodImageUploadComponent,
    MenuEditorComponent,
    FoodPoolComponent,
    MenuDayComponent,
    MenuMealingComponent,
    TagPoolComponent,
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        ImageCropperModule,
        MDBBootstrapModule.forRoot(),
        RouterModule.forRoot(appRoutes),
        AdsenseModule.forRoot({
            adClient: 'ca-pub-8068476996237937',
            adSlot: 1393101782,
        }),
        FormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule,
        MatAutocompleteModule,
        DragDropModule,
    ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [IdentityService, FoodService, ServerService, IngredientService, UnitService, AuthService, TagService, FamilyService, MealingService, CanDeactivateGuard],
  entryComponents: [GenericTwoButtonDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
