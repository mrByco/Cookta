import {StorageSection} from "../../models/storage-section.model";
import {ObjectId} from "mongodb";
import {User} from "../../models/user.model";
import {StoreService} from "atomik/lib/store-service/store-service";
import {IStorageItemChangeRequest} from "cookta-shared/src/contracts/stock/StorageItemChange.request";
import {Family} from "../../models/family.model";

export class StorageService extends StoreService<StorageSection> {

    constructor(createItemMethod: (id: ObjectId) => StorageSection, collectionName: string) {
        super(createItemMethod, collectionName);
    }


    public GetSections(family: Family): StorageSection[] {
        return this.Items.filter(i => i.FamilyId == family.Id.toHexString());
    }

    public CreateSection(user: User): StorageSection {
        let item = super.CreateItem(new ObjectId()) as StorageSection;
        item.FamilyId = user.currentFamilyId;
        if (!item.Items) item.Items = [];
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

    protected FromSaveJson(doc: any): StorageSection {
        let section = super.FromSaveJson(doc);
        if (section.Items == null) section.Items == [];
        return section;
    }
}
