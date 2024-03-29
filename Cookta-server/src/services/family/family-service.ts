import {Family} from '../../models/family.model';
import {StoreService} from 'atomik/lib/store-service/store-service';
import {User} from '../../models/user.model';
import {ObjectId} from 'mongodb';
import {Services} from '../../Services';
import {EFamilyRole} from 'cookta-shared/src/models/family-member/family.member';

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

    public GetUserRelatedFamilies(user: User | string): Family[] {
        let sub = user instanceof User ? user.sub : user;
        return this.FindAll(f => (f.members.find(u => u.sub == sub) != null));
    }

    public DeleteFamily(familyToDelete: Family | string) {
        let family = familyToDelete instanceof Family
            ? familyToDelete
            : Services.FamilyService.FindOne(f => f.Id.toHexString() == familyToDelete);
        let oldFamilyMembers = [...family.members];
        family.members = [];
        oldFamilyMembers.forEach((member) => {
            let user = Services.UserService.FindOne(u => u.sub == member.sub);
            user.currentFamilyId == null;
            user.currentFamilyId = user.GetCurrentFamily().Id.toHexString();
            user.Save();
        });
        this.RemoveItem(family);
    }

    public LeaveFamily(operatorUserSub: string, userSub: string, familyId: string) {
        let userToLeave = Services.UserService.FindOne(u => u.sub == userSub);
        let family = Services.FamilyService.GetUserRelatedFamilies(operatorUserSub).find(f => f.Id.toHexString() == familyId);

        if (family.ownerSub != operatorUserSub && operatorUserSub != userSub) return;

        if (operatorUserSub === userToLeave.sub && family.ownerSub == operatorUserSub) {
            if (family.members.length == 1) {
                this.DeleteFamily(family);
                return;
            }
            family.ownerSub = family.members[1].sub;
            family.members[1].role = EFamilyRole.owner;
        }

        family.members.splice(family.members.findIndex(m => m.sub == userToLeave.sub), 1);
        family.Save();

        if (userToLeave.currentFamilyId == familyId) {
            userToLeave.currentFamilyId = null;
            userToLeave.Save();
        }
    }

    //TODO Override remove item method to delete dependencies

}
