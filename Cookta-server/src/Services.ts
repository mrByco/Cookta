import { StorageService } from "./services/storage-service";
import {StoreItemBase} from "atomik/store-item/store-item-base";
import {FamilyService} from "./services/family-service";
import {UserService} from "./services/user-service";

export class Services {
    static StorageService: StorageService;
    static FamilyService: FamilyService;
    static UserService: UserService;

    static ToSendableList(items: StoreItemBase[]): any[]{
        let sendItems: any[] = [];
        for (let item of items){
            sendItems.push(item.ToSendJson());
        }
        return sendItems;
    }
}
