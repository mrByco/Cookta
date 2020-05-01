
import {Routes} from "../routes";
import { Controller } from "waxen/dist/deorators/controller";
import { Security } from "waxen/dist/deorators/security";
import { ProvideRequest } from "waxen/dist/deorators/provide-request";
import { User } from "../models/user.model";

@Controller(Routes.todos)
export class TodoController {

    @ProvideRequest()
    @Security(false, 'ok')
    public async Secured(reqBody: void, user: User, request: any, param1: string): Promise<User> {
        return user;
    }

    @Security(false, 'fail')
    public async Fail(reqBody: { id: string, name: string }, user: User): Promise<User> {
        return user;
    }

    @Security(false, 'ok')
    public async InternalFail(reqBody: void, user: User): Promise<User> {
        throw new Error('Route InternalFail is not implemented');
    }
}


