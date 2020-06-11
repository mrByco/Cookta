import {User} from '../../../models/user.model';
import {Services} from '../../../Services';
import {Controller} from 'waxen/dist/deorators/controller';
import {Security} from 'waxen/dist/deorators/security';
import {Contracts} from 'cookta-shared/src/contracts/contracts';
import {ExtendedUser} from 'cookta-shared/src/models/user/extendedUser';

//@ts-ignore
@Controller(Contracts.Users)
export class UserController {

    @Security(false)
    public async User(reqBody: void, user: User): Promise<ExtendedUser> {
        return user.ToExtendedUser();
    }

    @Security(false)
    public async SetUserName(reqBody: void, user: User, name: string): Promise<ExtendedUser> {
        user.username = name;
        Services.UserService.SaveItem(user);
        return user.ToExtendedUser();
    }

    @Security(false)
    public async GetNameAlreadyUsed(reqBody: void, user: User, name: string): Promise<boolean> {
        return (Services.UserService.FindOne(u => u.username && u.username.toLocaleLowerCase() == name.toLocaleLowerCase()) != undefined);
    }

    @Security(false)
    public async HasPermission(reqBody: void, user: User, permission: string): Promise<boolean> {
        if (permission == undefined) {
            return false;
        }
        return user.HasPermission(permission);
    }

    @Security(false, 'manage-users')
    public async GetAllUser(reqBody: void, user: User): Promise<ExtendedUser[]> {
        let users = Services.UserService.GetAllItems();
        let extended = users.map(u => u.ToExtendedUser());
        console.log(extended);
        return extended;
    }

    @Security(false, 'manage-users')
    public async EditUser(reqBody: { primarySub: string, roleId: string }, user: User): Promise<ExtendedUser> {
        if (Services.RoleService.GetRole(reqBody.roleId)) {
            Services.UserService.ChangeRole(reqBody.primarySub, reqBody.roleId);
        }
        let changedUser = Services.UserService.FindOne(u => u.sub == reqBody.primarySub);
        return changedUser.ToExtendedUser();

    }

    @Security(false)
    public async DeleteProfile(reqBody: void, user: User): Promise<{ deleted: boolean }> {
        if (!user) return { deleted: true };
        Services.UserService.DeleteUser(user);
        return { deleted: true };
    }
}
