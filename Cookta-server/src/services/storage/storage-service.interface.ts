import {User} from "../../models/user.model";
import {StorageSection} from "../../models/storage-section.model";
import {IStorageItemChangeRequest} from "../../interfaces/StorageItemChange.request";

export interface IStorageService extends IStorageItemChangeRequest{
    GetSections(user: User): StorageSection[];
    CreateSection(user: User): StorageSection;
    SetSection(user: User, sectionModify: IStorageItemChangeRequest): StorageSection;
    DeleteSection(user: User, sectionId: string);

}
