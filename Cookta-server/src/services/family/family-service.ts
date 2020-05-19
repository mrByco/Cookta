import {Family} from "../../models/family.model";
import {StoreService} from "atomik/lib/store-service/store-service";
import {User} from "../../models/user.model";
import {ObjectId} from "mongodb";
import {Services} from "../../Services";
import {EFamilyRole} from "cookta-shared/src/models/family-member/family.member";

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

    public GetUserFamilies(user: User | string): Family[] {
        let sub = user instanceof User ? user.sub : user;
        return this.FindAll(f => (f.members.find(u => u.sub == sub) != null))
    }

    //TODO Override remove item method to delete dependencies

}
