import { StorageService } from "./services/storage-service";
import {StoreItemBase} from "atomik/store-item/store-item-base";

export class Services {
    static StorageService: StorageService;

    static ToSendableList(items: StoreItemBase[]): any[]{
        let sendItems: any[] = [];
        for (let item of items){
            sendItems.push(item.ToSendJson());
        }
        return sendItems;
    }
}
