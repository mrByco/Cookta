import {IStorageService} from "./storage-service.interface";
import {IStoreService} from "atomik/store-service/store-service-interface";
import {StoreItemBase} from "atomik/store-item/store-item-base";

export class StorageServiceMock implements IStoreService  {
    Started: boolean;

    CreateItem(id: ObjectId): StoreItemBase {
        return undefined;
    }

    FindAll(p: (value: StoreItemBase) => boolean): any;
    FindAll(p: (value: StoreItemBase) => boolean);
    FindAll(p: (value: StoreItemBase) => boolean): any {
    }

    FindOne(p: (value: StoreItemBase) => boolean): any;
    FindOne(p: (value: StoreItemBase) => boolean);
    FindOne(p: (value: StoreItemBase) => boolean): any {
    }

    GetAllItems(): StoreItemBase[] {
        return [];
    }

    GetItem(id: ObjectId): StoreItemBase {
        return undefined;
    }

    SaveItem(item: StoreItemBase): Promise<void> {
        return undefined;
    }

    Start(): Promise<void> {
        return undefined;
    }

}
