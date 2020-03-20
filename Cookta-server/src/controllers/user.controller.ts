
import {Controller, Get, Put, Request, Route, Security, Tags} from "tsoa";
import {User} from "../models/user.model";
import {ExtendedUser} from "../models/extendedUser";

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
            user.Save();
            return user.ToExtendedUser();
        } catch {
            this.setStatus(500);
        }
    }
    @Security('Bearer')
    @Get('/permission/{permission}')
    public async HasPermission(@Request() request, permission: string): Promise<boolean>{
        try {
            if (permission == undefined){
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
