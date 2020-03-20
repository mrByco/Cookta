import {Family, SendFamily, SendFamilyMember} from "../models/family.model";
import {StoreService} from "atomik/store-service/store-service";
import {User} from "../models/user.model";
import {ObjectId} from "mongodb";
import {EFamilyRole} from "../interfaces/ifamilyMember";

export class FamilyService extends StoreService<Family> {

    public CreateFamily(owner: User, familyName: string): Family {
        let family = this.CreateItem(new ObjectId());
        family.ownerSub = owner.sub;
        family.name = familyName;
        family.members.push({role: EFamilyRole.owner, sub: owner.sub});
        family.Save();
        return family;
    }

    public GetUserFamilies(user: User): Family[] {
        return this.FindAll(f => f.members.find(u => u.sub == user.sub) != undefined)
    }

    //TODO Override remove item method to delete dependencies

}
