
import {Routes} from "../routes";
import { Controller } from "waxen/dist/deorators/controller";
import { Security } from "waxen/dist/deorators/security";
import { User } from "../models/user.model";

@Controller(Routes.todos)
export class TodoController {

    @Security(false, 'ok')
    public async Secured(reqBody: void, user: User): Promise<User> {
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


