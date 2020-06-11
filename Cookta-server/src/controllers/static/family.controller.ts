import {User} from '../../models/user.model';
import {Services} from '../../Services';
import {Security} from 'waxen/dist/deorators/security';
import {EFamilyRole} from 'cookta-shared/src/models/family-member/family.member';
import {Controller} from 'waxen/dist/deorators/controller';
import {Contracts} from 'cookta-shared/src/contracts/contracts';
import {ISendFamily} from 'cookta-shared/src/models/family/family.interface';
import {InviteFamilyRequest} from 'cookta-shared/src/contracts/family/invite.family.request';
import {NotFoundError} from '../../helpers/error.helper';

@Controller(Contracts.Family)
export class FamilyController {
    @Security(false)
    public async GetFamily(reqBody: void, user: User, familyId: string): Promise<ISendFamily> {
        return Services.FamilyService.GetUserRelatedFamilies(user).find(f => f.Id.toHexString() == familyId).ToSendFamily();
    }

    @Security(false)
    public async SwitchFamily(reqBody: void, user: User, newId: string): Promise<ISendFamily> {
        let family = Services.FamilyService.GetUserRelatedFamilies(user).find(f => f.Id.toHexString() == newId);
        if (!family) throw NotFoundError();

        user.SwitchCurrentFamily(family);
        return user.GetCurrentFamily().ToSendFamily();
    }
    @Security(false)
    public async DeleteFamily(reqBody: void, user: User, deleteId: string): Promise<ISendFamily> {
        let family = Services.FamilyService.FindOne(f => f.Id.toHexString() == deleteId);
        if (!family) throw NotFoundError();
        if (user.sub != family.ownerSub) throw NotFoundError();

        Services.FamilyService.DeleteFamily(deleteId);
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
        let familyToInvite = Services.FamilyService.GetUserRelatedFamilies(user).find(f => f.Id.toHexString() == familyId);
        let invited = Services.UserService.FindOne(u => u.email == reqBody.invitedEmail && u.username == reqBody.invitedUsername);
        if (!familyToInvite || invited == null)
            return null;
        familyToInvite.members.push({ role: EFamilyRole.partner, sub: invited.sub });
        await Services.FamilyService.SaveItem(familyToInvite);
        return familyToInvite.ToSendFamily();
    }


    @Security(false)
    public async LeaveFamily(reqBody: void, user: User, familyId: string, removeUserSub: string): Promise<ISendFamily> {
        Services.FamilyService.LeaveFamily(user.sub, removeUserSub, familyId)
        return user.GetCurrentFamily().ToSendFamily();
    }

}
