import {EssentialList} from "../models/essential-list.model";
import {StoreService} from "atomik/store-service/store-service";
import {Family} from "../models/family.model";
import { ObjectId } from "mongodb";

export class EssentialsService extends StoreService<EssentialList>{

    public GetEssentials(family: Family): EssentialList{
        return this.FindOne(i => i.FamilyId == family.Id.toHexString());
    }

    public CreateEssentials(family: Family): EssentialList {
        if (this.GetEssentials(family)){
            return this.GetEssentials(family);
        }
        let newEssentials = this.CreateItem(new ObjectId());
        newEssentials.FamilyId = family.Id.toHexString();
        this.SaveItem(newEssentials);
        //TODO Can not save
        return newEssentials;
    }
}
