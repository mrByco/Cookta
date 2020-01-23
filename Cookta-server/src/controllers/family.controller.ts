import {Body, Controller, Delete, Get, Post, Put, Request, Route, Security, Tags} from "tsoa";
import {User} from "../models/user.model";
import {Family, SendFamily} from "../models/family.model";
import {InviteFamilyRequest} from "../requests/invite.family.request";

@Route("/family")
@Tags("Family")
export class FamilyController extends Controller {
    @Security('Bearer', [])
    @Get("/{familyId}")
    public async GetFamily(@Request() request, familyId: string): Promise<Family> {
        try {
            let user = request.user as User;
            return Family.GetFamily(user, familyId);
        } catch {
            this.setStatus(500);
        }
    }
    @Security('Bearer', [])
    @Put("/{newId}")
    public async SwitchFamily(@Request() request, newId: string): Promise<Family> {
        try {
            let user = request.user as User;
            return await user.ChangeFamily(newId);
        } catch {
            this.setStatus(500);
        }
    }
    @Security('Bearer', [])
    @Delete("/{deleteId}")
    public async DeleteFamily(@Request() request, deleteId: string): Promise<SendFamily> {
        try {
            let user = request.user as User;
            let deleted = await Family.DeleteFamily(user, deleteId);
            return await (await Family.GetFamily(user, user.currentFamilyId)).ToSendFamily(user);
        } catch {
            this.setStatus(500);
        }
    }

    @Security('Bearer', [])
    @Post("/{name}")
    public async CreateFamily(@Request() request, name: string): Promise<SendFamily> {
        try {
            let user = request.user as User;
            let newFamily = await Family.CreateFamily(user, name);
            return await (await user.ChangeFamily(newFamily.id)).ToSendFamily(user);
        } catch {
            this.setStatus(500);
        }
    }

    @Security('Bearer', [])
    @Put('/{familyId}/invite')
    public async InviteByUserNameEmail(@Request() request, @Body() inv: InviteFamilyRequest, familyId: string): Promise<boolean> {
        try {
            let user = request.user as User;
            let familyToInvite = await Family.GetFamily(user, familyId);
            let invited = await User.GetUserByEmail(inv.invitedEmail);
            if (!familyToInvite || invited == null ||invited.username != inv.invitedUsername)
                return false;
            return await familyToInvite.JoinUserToFamily(user, invited);

        } catch {
            this.setStatus(500)
        }
        return false;
    }

    @Security('Bearer', [])
    @Delete('/{familyId}/leave/{removeUserSub}')
    public async LeaveFamily(@Request() request, familyId: string, removeUserSub: string): Promise<boolean> {
        try {
            let user = request.user as User;
            let userToLeave = await User.GetUser(removeUserSub);
            let family = await Family.GetFamily(user, familyId);
            if (!family)
                return false;
            return await family.GetOutUserFromFamily(user, userToLeave);
        } catch {
            this.setStatus(500)
        }
        return false;
    }

}
