import {StorageSection} from "../models/storage-section.model";
import {ObjectId} from "mongodb";
import {User} from "../models/user.model";
import {StoreService} from "atomik/store-service/store-service";
import {IStorageItemChangeRequest} from "../interfaces/StorageItemChange.request";

export class StorageService extends StoreService<StorageSection> {

    constructor(createItemMethod: (id: ObjectId, storeService: StoreService<StorageSection>) => StorageSection, collectionName: string) {
        super(createItemMethod, collectionName);
    }


    public GetSections(user: User): StorageSection[] {
        console.log(this.Items);
        return this.Items.filter(i => i.FamilyId == user.currentFamilyId);
    }
    public CreateSection(user: User): StorageSection {
        let item = super.CreateItem(new ObjectId()) as StorageSection;
        item.FamilyId = user.currentFamilyId;
        super.SaveItem(item);
        return item;
    }
    public SetSection(user: User, sectionModify: IStorageItemChangeRequest): StorageSection {
        let section = super.FindOne(i => i.FamilyId === user.currentFamilyId && i.Id.toHexString() === sectionModify.Id);
        if (!section)
            return null;

        if (sectionModify.Items){
            section.Items = sectionModify.Items;
        }
        if (sectionModify.Name){
            section.Name = sectionModify.Name;
        }
        if (sectionModify.GeneralList){
            section.GeneralList = sectionModify.GeneralList;
        }
        if (sectionModify.IsDefaultList){
            let sections = super.FindAll(s => s.FamilyId == user.currentFamilyId);
            for (let s of sections){
                if (s.IsDefaultList && s !== section){
                    s.IsDefaultList = false;
                    s.Save();
                }
            }
            section.IsDefaultList = true;
        }
        section.Save();
        return section;
    }
    public DeleteSection(user: User, sectionId: string){
        let section = super.FindOne(s => s.FamilyId == user.currentFamilyId && s.Id.toHexString() == sectionId);
        super.RemoveItem(section);
    }
}
