import {Body, Controller, Delete, Get, Post, Put, Request, Route, Security, Tags} from "tsoa";
import {User} from "../models/user.model";
import {Family, SendFamily} from "../models/family.model";
import {InviteFamilyRequest} from "../requests/invite.family.request";
import {Services} from "../Services";
import {EFamilyRole} from "../interfaces/ifamilyMember";

@Route("/family")
@Tags("Family")
export class FamilyController extends Controller {
    @Security('Bearer', [])
    @Get("/{familyId}")
    public async GetFamily(@Request() request, familyId: string): Promise<SendFamily> {
        try {
            let user = request.user as User;
            return Services.FamilyService.GetUserFamilies(user).find(f => f.Id.toHexString() == familyId).ToSendFamily();
        } catch {
            this.setStatus(500);
        }
    }
    @Security('Bearer', [])
    @Put("/{newId}")
    public async SwitchFamily(@Request() request, newId: string): Promise<SendFamily> {
        try {
            let user = request.user as User;
            let family = Services.FamilyService.GetUserFamilies(user).find(f => f.Id.toHexString() == newId);
            user.SwitchCurrentFamily(family);
            return user.GetCurrentFamily().ToSendFamily();
        } catch {
            this.setStatus(500);
        }
    }
    @Security('Bearer', [])
    @Delete("/{deleteId}")
    public async DeleteFamily(@Request() request, deleteId: string): Promise<SendFamily> {
        try {
            let user = request.user as User;
            let family = Services.FamilyService.GetUserFamilies(user).find(f => f.Id.toHexString() == deleteId);
            let deleted = await Services.FamilyService.RemoveItem(family);
            return user.GetCurrentFamily().ToSendFamily();
        } catch {
            this.setStatus(500);
        }
    }

    @Security('Bearer', [])
    @Post("/{name}")
    public async CreateFamily(@Request() request, name: string): Promise<SendFamily> {
        try {
            let user = request.user as User;
            let newFamily = Services.FamilyService.CreateFamily(user, name);
            user.SwitchCurrentFamily(newFamily);
            return newFamily.ToSendFamily();
        } catch {
            this.setStatus(500);
        }
    }

    @Security('Bearer', [])
    @Put('/{familyId}/invite')
    public async InviteByUserNameEmail(@Request() request, @Body() inv: InviteFamilyRequest, familyId: string): Promise<SendFamily> {
        try {
            let user = request.user as User;
            let familyToInvite = Services.FamilyService.GetUserFamilies(user).find(f => f.Id.toHexString() == familyId);
            let invited = Services.UserService.FindOne(u => u.email == inv.invitedEmail && u.username == inv.invitedUsername);
            if (!familyToInvite || invited == null)
                return null;
            familyToInvite.members.push({role: EFamilyRole.partner, sub: invited.sub});
            await familyToInvite.Save();
            return familyToInvite.ToSendFamily();

        } catch {
            this.setStatus(500)
        }
    }

    @Security('Bearer', [])
    @Delete('/{familyId}/leave/{removeUserSub}')
    public async LeaveFamily(@Request() request, familyId: string, removeUserSub: string): Promise<SendFamily> {
        try {
            let user = request.user as User;
            let userToLeave = await Services.UserService.FindOne(u => u.sub == removeUserSub);
            let family = await Services.FamilyService.GetUserFamilies(user).find(f => f.Id.toHexString() == familyId);
            if (user === userToLeave && family.ownerSub == user.sub){
                return null;
            }
            if (userToLeave.sub == family.ownerSub)
                return null;
            family.members.splice(family.members.findIndex(m => m.sub == userToLeave.sub), 1);
            family.Save();
            return user.GetCurrentFamily().ToSendFamily();
        } catch {
            this.setStatus(500)
        }
    }

}
