import {BrowserModule} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';

import {AppComponent} from './app.component';
import {RootComponentComponent} from './root-component/root-component.component';
import {NavigationBarComponent} from './navigation-bar/navigation-bar.component';
import {FoodItemComponent} from './food/food-other/food-item/food-item.component';
import {FoodDetailComponent} from './food/food-page/food-detail/food-detail.component';
import {FoodListComponent} from './food/food-other/food-list/food-list.component';
import {IconsModule, MDBBootstrapModule} from 'angular-bootstrap-md';
import {HttpClientModule} from '@angular/common/http';
import {IdentityService} from './shared/services/identity.service';
import {FoodService} from './shared/services/food.service';
import {ServerService} from './shared/services/server.service';
import {RouterModule, Routes} from '@angular/router';
import {IngredientService} from './shared/services/ingredient-service/ingredient.service';
import {FoodIngredientComponent} from './food/food-assemblies/food-ingredient/food-ingredient.component';
import {UnitService} from './shared/services/unit-service/unit.service';
import {AuthService} from './shared/services/auth.service';
import {FoodCollectionListComponent} from './food/food-other/food-collection-list/food-collection-list.component';
import {LoginModalComponent} from './identity/login-modal/login-modal.component';
import {TagService} from './shared/services/tag.service';
import {FoodTagComponent} from './food/food-assemblies/food-tag/food-tag.component';
import {FoodEditComponent} from './food/food-page/food-edit/food-edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IngredientAdderComponent} from './food/food-assemblies/ingredient-adder/ingredient-adder.component';
import {AutoCompleteComponent} from './utilities/auto-complete/auto-complete.component';
import {TagAdderComponent} from './food/food-assemblies/tag-adder/tag-adder.component';
import {IngredientEditorComponent} from './admin-components/ingredient-editor/ingredient-editor.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {IngredientItemPopupComponent} from './admin-components/ingredient-editor/ingredient-item-popup/ingredient-item-popup.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {GenericTwoButtonDialogComponent} from './utilities/generic-two-button-dialog/generic-two-button-dialog.component';
import {CanDeactivateGuard} from './guards/can-deactivate-guard';
import {FoodImageUploadComponent} from './food/food-assemblies/food-image-upload/food-image-upload.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {FamilyService} from './shared/services/family.service';
import {MenuEditorComponent} from './menu/menu-editor/menu-editor.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MenuDayComponent} from './menu/menu-day/menu-day.component';
import {MenuMealingComponent} from './menu/menu-mealing/menu-mealing.component';
import {MealingService} from './shared/services/mealing.service';
import {DebugOptionsComponent} from './admin-components/debug-options/debug-options.component';
import {FamilyManagementComponent} from './profile/family/family-management/family-management.component';
import {FamilyEditPageComponent} from './profile/family/family-edit-page/family-edit-page.component';
import {FamilyDetailsPageComponent} from './profile/family/family-details-page/family-details-page.component';
import {StorageRootComponentComponent} from './stock/storage-root-component/storage-root-component.component';
import {StorageSectionComponent} from './stock/storage-section/storage-section.component';
import {EssentialsRootComponent} from './stock/essentials-root/essentials-root.component';
import {EssentialsListComponent} from './stock/essentials-list/essentials-list.component';
import {ShoppingListRootComponent} from './shopping/shopping-list-root/shopping-list-root.component';
import {ShoppingListPanelComponent} from './shopping/shopping-list-panel/shopping-list-panel.component';
import {IngredientAdderSeamlessComponent} from './food/food-assemblies/ingredient-adder-seamless/ingredient-adder-seamless.component';
import {ContenteditableModule} from "@ng-stack/contenteditable";
import {CanActivateLoggedInGuard} from "./guards/can-activate-logged-in.guard";
import {DeleteCustomUnitPopupComponent} from './admin-components/ingredient-editor/delete-custom-unit-popup/delete-custom-unit-popup.component';
import {MenuPoolComponent} from './menu/menu-pool/menu-pool.component';
import {MenuPoolToolbarComponent} from './menu/menu-pool/menu-pool-toolbar/menu-pool-toolbar.component';
import {MenuPoolItemComponent} from './menu/menu-pool/menu-pool-item/menu-pool-item.component';
import {BadUnitFixerComponent} from './admin-components/ingredient-editor/bad-unit-fixer/bad-unit-fixer.component';
import { DeleteIngredientPupopComponent } from './admin-components/ingredient-editor/delete-ingredient-pupop/delete-ingredient-pupop.component';
import { SearchInputComponent } from './food/search/search-input/search-input.component';
import { SearchComponent } from './food/search/search.component';
import {RenameModalComponent} from "./identity/rename-modal/rename-modal.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSliderModule} from "@angular/material/slider";
import { RoleEditorComponent } from './admin-components/role-editor/role-editor/role-editor.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { UserListComponent } from './admin-components/user-list/user-list.component';
import {MatTabsModule} from "@angular/material/tabs";
import {LiveConnectionService} from './shared/services/live-connect.service/live-connection.service';
import { UserProfileModalComponent } from './profile/user-profile/user-profile-modal/user-profile-modal.component';
import { UserProfilePanelComponent } from './profile/user-profile/user-profile-panel/user-profile-panel.component';
import { ConfirmDeleteModalComponent } from './identity/confirm-delete-modal/confirm-delete-modal.component';

const appRoutes: Routes = [
    {path: '', component: FoodListComponent},
    {path: 'foods', component: FoodListComponent},
    {path: 'ingredient-editor', component: IngredientEditorComponent, canActivate: [CanActivateLoggedInGuard]},
    {path: 'role-editor', component: RoleEditorComponent, canActivate: [CanActivateLoggedInGuard]},
    {path: 'user-editor', component: UserListComponent, canActivate: [CanActivateLoggedInGuard]},
    {path: 'debug-options', component: DebugOptionsComponent},
    {path: 'foods/collection', component: FoodCollectionListComponent, canActivate: [CanActivateLoggedInGuard]},
    {path: 'foods/:id/:day/:mealIndex', component: FoodDetailComponent, canActivate: [CanActivateLoggedInGuard]},
    {path: 'foods/:id', component: FoodDetailComponent},
    {
        path: 'foods/:id/edit',
        component: FoodEditComponent,
        canDeactivate: [CanDeactivateGuard],
        canActivate: [CanActivateLoggedInGuard]
    },
    {path: 'search/:text', component: SearchComponent},
    {path: 'family-manager', component: FamilyManagementComponent, canActivate: [CanActivateLoggedInGuard]},
    {path: 'essentials', component: EssentialsRootComponent, canActivate: [CanActivateLoggedInGuard]},
    {path: 'calendar', component: MenuEditorComponent, canActivate: [CanActivateLoggedInGuard]},
    {path: 'storage', component: StorageRootComponentComponent, canActivate: [CanActivateLoggedInGuard]},
    {path: 'shopping', component: ShoppingListRootComponent, canActivate: [CanActivateLoggedInGuard]}

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
        MenuDayComponent,
        MenuMealingComponent,
        DebugOptionsComponent,
        FamilyManagementComponent,
        FamilyEditPageComponent,
        FamilyDetailsPageComponent,
        StorageRootComponentComponent,
        StorageSectionComponent,
        EssentialsRootComponent,
        EssentialsListComponent,
        ShoppingListRootComponent,
        ShoppingListPanelComponent,
        IngredientAdderSeamlessComponent,
        DeleteCustomUnitPopupComponent,
        MenuPoolComponent,
        MenuPoolToolbarComponent,
        MenuPoolItemComponent,
        BadUnitFixerComponent,
        DeleteIngredientPupopComponent,
        SearchInputComponent,
        SearchComponent,
        RenameModalComponent,
        RoleEditorComponent,
        UserListComponent,
        UserProfileModalComponent,
        UserProfilePanelComponent,
        ConfirmDeleteModalComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        ImageCropperModule,
        MDBBootstrapModule.forRoot(),
        RouterModule.forRoot(appRoutes),
        FormsModule,
        IconsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule,
        MatAutocompleteModule,
        DragDropModule,
        ReactiveFormsModule,
        ContenteditableModule,
        MatProgressSpinnerModule,
        MatSliderModule,
        MatProgressBarModule,
        MatTabsModule,
    ],
    schemas: [NO_ERRORS_SCHEMA],
    providers: [IdentityService, FoodService, ServerService, IngredientService, UnitService, AuthService, TagService, FamilyService, MealingService, LiveConnectionService, CanDeactivateGuard, CanActivateLoggedInGuard],
    entryComponents: [GenericTwoButtonDialogComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}

