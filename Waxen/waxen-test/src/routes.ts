import {IRoute} from "waxen/dist/abstract/route.interface"
import {ERouteMethod} from "waxen/dist/route-method.enum";
import {ControllerData} from "waxen/dist/abstract/controller.interface";
import {User} from "./models/user.model";


const Secured: IRoute<void, User, { param1: string }> = {path: 'secured', method: ERouteMethod.GET}
const Fail: IRoute<{ id: string, name: string }, User, void> = {
    path: 'fail',
    method: ERouteMethod.GET
}
const InternalFail: IRoute<void, User, void> = {
    path: 'optional',
    method: ERouteMethod.GET
}

const Todos: ControllerData = {name: "Todos", basepath: '', routes: [Secured, Fail, InternalFail]}

export const Routes = {
    todos: Todos,
}
