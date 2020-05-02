import {IRoute} from "waxen/dist/abstract/route.interface";
import {ERouteMethod} from "waxen/dist/route-method.enum";
import {ControllerData} from "waxen/dist/abstract/controller.interface";
import {ExtendedUser} from "../../models/user/extendedUser";

const User: IRoute<void, ExtendedUser, void> = {method: ERouteMethod.GET, path: ''};
const SetUserName: IRoute<void, ExtendedUser, { name: string }> = {method: ERouteMethod.PUT, path: ''};
const GetNameAlreadyUsed: IRoute<void, boolean, { name: string }> = {method: ERouteMethod.GET, path: ''};
const HasPermission: IRoute<void, boolean, { permission: string }> = {method: ERouteMethod.GET, path: 'permission'};

export const UserControllerData: ControllerData = {
    basepath: "user", name: "User", routes: [User, SetUserName, GetNameAlreadyUsed, HasPermission]
}
