import {Controller, Get, Put, Request, Route, Security, Tags} from 'tsoa';
import {User} from '../models/user.model';
import {ExtendedUser} from 'cookta-shared/models/user/extendedUser';
import {Services} from '../Services';

@Tags('User')
@Route('/user')
export class UserController extends Controller {
    @Security('Bearer')
    @Get()
    public async User(@Request() request): Promise<ExtendedUser> {
        let user = request.user as User;
        return user.ToExtendedUser();
        try {
        } catch {
            this.setStatus(500);
        }
    }

    @Security('Bearer')
    @Put('/{name}')
    public async SetUserName(@Request() request, name: string): Promise<ExtendedUser> {
        try {
            let user = request.user as User;
            user.username = name;
            Services.UserService.SaveItem(user);
            return user.ToExtendedUser();
        } catch {
            this.setStatus(500);
        }
    }

    @Get('/{name}')
    public async GetNameAlreadyUsed(@Request() request, name: string): Promise<boolean> {
        return (Services.UserService.FindOne(u => u.username && u.username.toLocaleLowerCase() == name.toLocaleLowerCase()) != undefined);
    }

    @Security('Bearer')
    @Get('/permission/{permission}')
    public async HasPermission(@Request() request, permission: string): Promise<boolean> {
        try {
            if (permission == undefined) {
                this.setStatus(400);
                return;
            }
            let user = request.user as User;
            return user.HasPermission(permission);
        } catch {
            this.setStatus(500);
        }
    }


}
