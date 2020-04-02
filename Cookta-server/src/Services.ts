import { StorageService } from "./services/storage/storage-service";
import {StoreItemBase} from "atomik/lib/store-item/store-item-base";
import {FamilyService} from "./services/family/family-service";
import {UserService} from "./services/user/user-service";
import {EssentialsService} from "./services/essentials/essentials-service";
import {IUnitService} from "./services/unit/unit.service.interface";
import {IIngredientTypeService} from "./services/ingredient-types/ingredient-type.service.interface";
import {IShoppingListService} from "./services/shopping-list/shopping-list.service.interface";

export class Services {
    static StorageService: StorageService;
    static FamilyService: FamilyService;
    static UserService: UserService;
    static EssentialsService: EssentialsService;
    static UnitService: IUnitService;
    static IngredientTypeService: IIngredientTypeService;
    static ShoppingListService: IShoppingListService;

    static ToSendableList(items: StoreItemBase[]): any[]{
        let sendItems: any[] = [];
        for (let item of items){
            sendItems.push(item.ToSendJson());
        }
        return sendItems;
    }
}
