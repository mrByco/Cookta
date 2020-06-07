import {User} from "../../models/user.model";
import {Services} from "../../Services";
import {Security} from "waxen/dist/deorators/security";
import {EFamilyRole} from 'cookta-shared/src/models/family-member/family.member';
import {Controller} from "waxen/dist/deorators/controller";
import {Contracts} from "cookta-shared/src/contracts/contracts";
import {ISendFamily} from "cookta-shared/src/models/family/family.interface";
import {InviteFamilyRequest} from "cookta-shared/src/contracts/family/invite.family.request";
import {NotFoundError} from "../../helpers/error.helper";

@Controller(Contracts.Family)
export class FamilyController {
    @Security(false)
    public async GetFamily(reqBody: void, user: User, familyId: string): Promise<ISendFamily> {
        return Services.FamilyService.GetUserFamilies(user).find(f => f.Id.toHexString() == familyId).ToSendFamily();
    }
    @Security(false)
    public async SwitchFamily(reqBody: void, user: User, newId: string): Promise<ISendFamily> {
        let family = Services.FamilyService.GetUserFamilies(user).find(f => f.Id.toHexString() == newId);
        if (!family) {
            throw NotFoundError();
        }
        user.SwitchCurrentFamily(family);
        return user.GetCurrentFamily().ToSendFamily();
    }
    @Security(false)
    public async DeleteFamily(reqBody: void, user: User, deleteId: string): Promise<ISendFamily> {
        let family = Services.FamilyService.GetUserFamilies(user).find(f => f.Id.toHexString() == deleteId);
        let deleted = await Services.FamilyService.RemoveItem(family);
        return user.GetCurrentFamily().ToSendFamily();
    }

    @Security(false)
    public async CreateFamily(reqBody: void, user: User, name: string): Promise<ISendFamily> {
        let newFamily = Services.FamilyService.CreateFamily(user, name);
        user.SwitchCurrentFamily(newFamily);
        return newFamily.ToSendFamily();
    }

    @Security(false)
    public async InviteByUserNameEmail(reqBody: InviteFamilyRequest, user: User, familyId: string): Promise<ISendFamily> {
        let familyToInvite = Services.FamilyService.GetUserFamilies(user).find(f => f.Id.toHexString() == familyId);
        let invited = Services.UserService.FindOne(u => u.email == reqBody.invitedEmail && u.username == reqBody.invitedUsername);
        if (!familyToInvite || invited == null)
            return null;
        familyToInvite.members.push({ role: EFamilyRole.partner, sub: invited.sub });
        await Services.FamilyService.SaveItem(familyToInvite);
        return familyToInvite.ToSendFamily();
    }


    @Security(false)
    public async LeaveFamily(reqBody: void, user: User, familyId: string, removeUserSub: string): Promise<ISendFamily> {
        let userToLeave = await Services.UserService.FindOne(u => u.sub == removeUserSub);
        let family = await Services.FamilyService.GetUserFamilies(user).find(f => f.Id.toHexString() == familyId);
        if (user === userToLeave && family.ownerSub == user.sub) {
            return null;
        }
        if (userToLeave.sub == family.ownerSub)
            return null;
        family.members.splice(family.members.findIndex(m => m.sub == userToLeave.sub), 1);
        family.Save();
        return user.GetCurrentFamily().ToSendFamily();
    }

}
