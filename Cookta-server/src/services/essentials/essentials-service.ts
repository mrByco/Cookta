import {EssentialSection} from '../../models/essentials/essential-list.model';
import {StoreService} from 'atomik/lib/store-service/store-service';
import {ObjectId} from 'mongodb';

export class EssentialsService extends StoreService<EssentialSection>{

    public GetEssentials(familyId: string): EssentialSection{
        return this.FindOne(i => i.FamilyId == familyId);
    }

    public CreateEssentials(familyId: string): EssentialSection {
        if (this.GetEssentials(familyId)){
            return this.GetEssentials(familyId);
        }
        let newEssentials = this.CreateItem(new ObjectId());
        newEssentials.FamilyId = familyId;
        newEssentials.Essentials = [];
        this.SaveItem(newEssentials);
        return newEssentials;
    }
}
