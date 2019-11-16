import {Controller, Get, Put, Request, Route, Security, Tags} from "tsoa";
import {User} from "../models/user.model";

@Tags('User')
@Route('/user')
export class UserController extends Controller {
    @Security('Bearer')
    @Get()
    public async User(@Request() request): Promise<User> {
        try {
            let user = request.user as User;
            return user;
        } catch {
            this.setStatus(500);
        }
    }

    @Security('User')
    @Put('/{name}')
    public async User(@Request() request): Promise<User> {
        try {
            let user = request.user as User;
            return user;
        } catch {
            this.setStatus(500);
        }
    }
}
