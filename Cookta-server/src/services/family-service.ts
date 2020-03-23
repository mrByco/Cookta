import {Family, SendFamily, SendFamilyMember} from "../models/family.model";
import {StoreService} from "atomik/store-service/store-service";
import {User} from "../models/user.model";
import {ObjectId} from "mongodb";
import {EFamilyRole} from "../interfaces/ifamilyMember";
import {Services} from "../Services";

export class FamilyService extends StoreService<Family> {

    public CreateFamily(owner: User, familyName: string): Family {
        let family = this.CreateItem(new ObjectId());
        family.ownerSub = owner.sub;
        family.name = familyName;
        family.members = [];
        family.members.push({role: EFamilyRole.owner, sub: owner.sub});
        Services.FamilyService.SaveItem(family);
        return family;
    }

    public GetUserFamilies(user: User): Family[] {
        return this.FindAll(f => (f.members.find(u => u.sub == user.sub) != null))
    }

    //TODO Override remove item method to delete dependencies

}
