import {EssentialSection} from "../../models/essentials/essential-list.model";
import {StoreService} from "atomik/lib/store-service/store-service";
import {Family} from "../../models/family.model";
import { ObjectId } from "mongodb";

export class EssentialsService extends StoreService<EssentialSection>{

    public GetEssentials(family: Family): EssentialSection{
        return this.FindOne(i => i.FamilyId == family.Id.toHexString());
    }

    public CreateEssentials(family: Family): EssentialSection {
        if (this.GetEssentials(family)){
            return this.GetEssentials(family);
        }
        let newEssentials = this.CreateItem(new ObjectId());
        newEssentials.FamilyId = family.Id.toHexString();
        newEssentials.Essentials = [];
        this.SaveItem(newEssentials);
        return newEssentials;
    }
}
