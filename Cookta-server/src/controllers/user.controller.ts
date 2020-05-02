import {User} from '../models/user.model';
import {Services} from '../Services';
import {Controller} from "waxen/dist/deorators/controller";
import { Security } from 'waxen/dist/deorators/security';
import {Contracts} from "cookta-shared/src/contracts/contracts";
import { ExtendedUser } from 'cookta-shared/src/models/user/extendedUser';

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


}
