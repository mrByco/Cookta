import {IRoute} from "waxen/dist/abstract/route.interface";
import {ERouteMethod} from "waxen/dist/route-method.enum";
import {ControllerData} from "waxen/dist/abstract/controller.interface";
import {IStorageSection} from "../../models/storage-sections/storage-section.interface";
import {IStorageItemChangeRequest} from "./StorageItemChange.request";
import {IStorageSectionRequest} from "./IStorageSectionRequest";

const GetAll: IRoute<void, any, void> = {method: ERouteMethod.GET, path: ''};
const CreateSection: IRoute<void, IStorageSection, void> = {method: ERouteMethod.POST, path: ''};
const EditSection: IRoute<IStorageItemChangeRequest, IStorageSectionRequest, void> = {method: ERouteMethod.PUT, path: ''};
const DeleteSection: IRoute<void, IStorageSection[], {sectionIdString: string}> = {method: ERouteMethod.PUT, path: ''};

export const StorageControllerData: ControllerData = {
    basepath: "stock", name: "Stock", routes: [GetAll, CreateSection, EditSection, DeleteSection]
}
