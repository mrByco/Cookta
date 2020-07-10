import {FoodControllerData} from './foods/foods';
import {DayControllerData} from './days/days';
import {EssentialControllerData} from './essentials/essentials';
import {FamilyControllerData} from './family/family';
import {IngredientTypeControllerData} from './ingredient-type/ingredient-type';
import {PingControllerData} from './ping/ping';
import {ShoppingListControllerData} from './shopping-list/shopping-list';
import {StorageControllerData} from './stock/stock';
import {SubscriptionControllerData} from './subscription/subscription';
import {TagControllerData} from './tags/tags';
import {UnitControllerData} from './units/units';
import {UserControllerData} from './users/users';
import {RoleControllerData} from './roles/roles';
import {HomeControllerData} from './home/home';
import {ReportControllerData} from './reports/report';


// @ts-ignore
export const Contracts = {
    Days: DayControllerData,
    Essentials: EssentialControllerData,
    Family: FamilyControllerData,
    Foods: FoodControllerData,
    IngredientType: IngredientTypeControllerData,
    Ping: PingControllerData,
    ShoppingList: ShoppingListControllerData,
    Storage: StorageControllerData,
    Subscription: SubscriptionControllerData,
    Tags: TagControllerData,
    Units: UnitControllerData,
    Users: UserControllerData,
    Roles: RoleControllerData,
    Home: HomeControllerData,
    Reports: ReportControllerData
};
