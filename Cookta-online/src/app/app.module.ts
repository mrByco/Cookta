import {BrowserModule} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';

import {AppComponent} from '@src/app/app.component';
import {RootComponentComponent} from '@src/app/root-component/root-component.component';
import {NavigationBarComponent} from '@src/app/navigation-bar/navigation-bar.component';
import {FoodItemComponent} from '@src/app/food/food-other/food-item/food-item.component';
import {FoodDetailComponent} from '@src/app/food/food-page/food-detail/food-detail.component';
import {FoodListComponent} from '@src/app/food/food-other/food-list/food-list.component';
import {IconsModule, MDBBootstrapModule} from 'angular-bootstrap-md';
import {HttpClientModule} from '@angular/common/http';
import {IdentityService} from '@src/app/shared/services/identity.service';
import {FoodService} from '@src/app/shared/services/food.service';
import {ServerService} from '@src/app/shared/services/server.service';
import {RouterModule, Routes} from '@angular/router';
import {IngredientService} from '@src/app/shared/services/ingredient-service/ingredient.service';
import {FoodIngredientComponent} from '@src/app/food/food-assemblies/food-ingredient/food-ingredient.component';
import {UnitService} from '@src/app/shared/services/unit-service/unit.service';
import {AuthService} from '@src/app/shared/services/auth.service';
import {FoodCollectionListComponent} from '@src/app/food/food-other/food-collection-list/food-collection-list.component';
import {LoginModalComponent} from '@src/app/identity/login-modal/login-modal.component';
import {TagService} from '@src/app/shared/services/tag.service';
import {FoodTagComponent} from '@src/app/food/food-assemblies/food-tag/food-tag.component';
import {FoodEditComponent} from '@src/app/food/food-page/food-edit/food-edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IngredientAdderComponent} from '@src/app/food/food-assemblies/ingredient-adder/ingredient-adder.component';
import {AutoCompleteComponent} from '@src/app/utilities/auto-complete/auto-complete.component';
import {TagAdderComponent} from '@src/app/food/food-assemblies/tag-adder/tag-adder.component';
import {IngredientEditorComponent} from '@src/app/admin-components/ingredient-editor/ingredient-editor.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {IngredientItemPopupComponent} from '@src/app/admin-components/ingredient-editor/ingredient-item-popup/ingredient-item-popup.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {GenericTwoButtonDialogComponent} from '@src/app/utilities/generic-two-button-dialog/generic-two-button-dialog.component';
import {CanDeactivateGuard} from '@src/app/guards/can-deactivate-guard';
import {FoodImageUploadComponent} from '@src/app/food/food-assemblies/food-image-upload/food-image-upload.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {FamilyService} from '@src/app/shared/services/family.service';
import {MenuEditorComponent} from '@src/app/menu/menu-editor/menu-editor.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MenuDayComponent} from '@src/app/menu/menu-day/menu-day.component';
import {MenuMealingComponent} from '@src/app/menu/menu-mealing/menu-mealing.component';
import {MealingService} from '@src/app/shared/services/mealing.service';
import {DebugOptionsComponent} from '@src/app/admin-components/debug-options/debug-options.component';
import {FamilyManagementComponent} from '@src/app/profile/family/family-management/family-management.component';
import {FamilyEditPageComponent} from '@src/app/profile/family/family-edit-page/family-edit-page.component';
import {FamilyDetailsPageComponent} from '@src/app/profile/family/family-details-page/family-details-page.component';
import {StorageRootComponentComponent} from '@src/app/stock/storage-root-component/storage-root-component.component';
import {StorageSectionComponent} from '@src/app/stock/storage-section/storage-section.component';
import {EssentialsRootComponent} from '@src/app/stock/essentials-root/essentials-root.component';
import {EssentialsListComponent} from '@src/app/stock/essentials-list/essentials-list.component';
import {ShoppingListRootComponent} from '@src/app/shopping/shopping-list-root/shopping-list-root.component';
import {ShoppingListPanelComponent} from '@src/app/shopping/shopping-list-panel/shopping-list-panel.component';
import {IngredientAdderSeamlessComponent} from '@src/app/food/food-assemblies/ingredient-adder-seamless/ingredient-adder-seamless.component';
import {ContenteditableModule} from '@ng-stack/contenteditable';
import {CanActivateLoggedInGuard} from '@src/app/guards/can-activate-logged-in.guard';
import {DeleteCustomUnitPopupComponent} from '@src/app/admin-components/ingredient-editor/delete-custom-unit-popup/delete-custom-unit-popup.component';
import {MenuPoolComponent} from '@src/app/menu/menu-pool/menu-pool.component';
import {MenuPoolToolbarComponent} from '@src/app/menu/menu-pool/menu-pool-toolbar/menu-pool-toolbar.component';
import {MenuPoolItemComponent} from '@src/app/menu/menu-pool/menu-pool-item/menu-pool-item.component';
import {BadUnitFixerComponent} from '@src/app/admin-components/ingredient-editor/bad-unit-fixer/bad-unit-fixer.component';
import {DeleteIngredientPupopComponent} from '@src/app/admin-components/ingredient-editor/delete-ingredient-pupop/delete-ingredient-pupop.component';
import {SearchInputComponent} from '@src/app/food/search/search-input/search-input.component';
import {SearchComponent} from '@src/app/food/search/search.component';
import {RenameModalComponent} from '@src/app/identity/rename-modal/rename-modal.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSliderModule} from '@angular/material/slider';
import {RoleEditorComponent} from '@src/app/admin-components/role-editor/role-editor/role-editor.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {UserListComponent} from '@src/app/admin-components/user-list/user-list.component';
import {MatTabsModule} from '@angular/material/tabs';
import {LiveConnectionService} from '@src/app/shared/services/live-connect.service/live-connection.service';
import {UserProfileModalComponent} from '@src/app/profile/user-profile/user-profile-modal/user-profile-modal.component';
import {UserProfilePanelComponent} from '@src/app/profile/user-profile/user-profile-panel/user-profile-panel.component';
import {ConfirmDeleteModalComponent} from '@src/app/identity/confirm-delete-modal/confirm-delete-modal.component';
import {PublicFoodsComponent} from '@src/app/food/food-other/public-foods/public-foods.component';
import {HomeComponentComponent} from '@src/app/home/home-component/home-component.component';
import {SquareHomeContentComponent} from '@src/app/home/square-home-content/square-home-content.component';
import {RowHomeContentComponent} from '@src/app/home/row-home-content/row-home-content.component';
import {HomeService} from '@src/app/shared/services/home.service';
import {FoodSearchPageComponent} from '@src/app/food/search/food-search-page/food-search-page.component';
import {SearchService} from '@src/app/food/search/search.service';
import {ErrorListComponent} from '@src/app/admin-components/error-list/error-list.component';
import {FinishShoppingModalComponent} from '@src/app/shopping/finish-shopping-modal/finish-shopping-modal.component';
import {ShoppingQuantityBoxComponent} from '@src/app/shopping/finish-shopping-modal/shopping-quantity-box/shopping-quantity-box.component';
import {MatInputModule} from "@angular/material/input"
import {MustLoginComponent} from '@src/app/profile/must-login/must-login.component';
import {HowToComponent} from '@src/app/usability/how-to/how-to.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {StockerComponent} from '@src/app/stock/stocker/stocker.component';
import {IngredientQuantityInputComponent} from '@src/app/food/food-assemblies/ingredient-quantity-input/ingredient-quantity-input.component';
import {AutoGeneratedComponent} from '@src/app/auto-generated/auto-generated.component';


const appRoutes: Routes = [
    {path: '', component: HomeComponentComponent},
    {path: 'foods', component: FoodSearchPageComponent},
    {path: 'ingredient-editor', component: IngredientEditorComponent, canActivate: [CanActivateLoggedInGuard]},
    {path: 'role-editor', component: RoleEditorComponent, canActivate: [CanActivateLoggedInGuard]},
    {path: 'user-editor', component: UserListComponent, canActivate: [CanActivateLoggedInGuard]},
    {path: 'error-list', component: ErrorListComponent, canActivate: [CanActivateLoggedInGuard]},
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
    {path: 'how-to', component: HowToComponent},
    {path: 'search/:text', component: SearchComponent},
    {path: 'family-manager', component: FamilyManagementComponent, canActivate: [CanActivateLoggedInGuard]},
    {path: 'essentials', component: EssentialsRootComponent, canActivate: [CanActivateLoggedInGuard]},
    {path: 'calendar', component: MenuEditorComponent, canActivate: [CanActivateLoggedInGuard]},
    {path: 'storage', component: StorageRootComponentComponent, canActivate: [CanActivateLoggedInGuard]},
    {path: 'stocker', component: StockerComponent, canActivate: [CanActivateLoggedInGuard]},
    {path: 'shopping', component: ShoppingListRootComponent, canActivate: [CanActivateLoggedInGuard]},
    {path: 'login', component: MustLoginComponent, children: [
            { path: '**', component: MustLoginComponent}
        ]}

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
        PublicFoodsComponent,
        HomeComponentComponent,
        SquareHomeContentComponent,
        RowHomeContentComponent,
        FoodSearchPageComponent,
        ErrorListComponent,
        FinishShoppingModalComponent,
        ShoppingQuantityBoxComponent,
        MustLoginComponent,
        HowToComponent,
        StockerComponent,
        IngredientQuantityInputComponent,
        AutoGeneratedComponent

    ],
    imports: [
        BrowserModule.withServerTransition({appId: 'serverApp'}),
        HttpClientModule,
        ImageCropperModule,
        MDBBootstrapModule.forRoot(),
        RouterModule.forRoot(appRoutes, {
            initialNavigation: 'enabled'
        }),
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
        MatInputModule,
        MatExpansionModule,
    ],
    schemas: [NO_ERRORS_SCHEMA],
    providers: [IdentityService, FoodService, ServerService, IngredientService, UnitService, AuthService, TagService, FamilyService, SearchService, HomeService, MealingService, LiveConnectionService, CanDeactivateGuard, CanActivateLoggedInGuard],
    entryComponents: [GenericTwoButtonDialogComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}

