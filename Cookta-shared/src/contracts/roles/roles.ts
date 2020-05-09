import {IRoute} from "waxen/dist/abstract/route.interface";
import {ERouteMethod} from "waxen/dist/route-method.enum";
import {ControllerData} from "waxen/dist/abstract/controller.interface";
import {IRole} from "../../models/roles/role.interface";

const GetRoles: IRoute<void, IRole[], void> = {method: ERouteMethod.GET, path: ''};
const SetRole: IRoute<IRole, {success: boolean, edited: IRole}, void> = {method: ERouteMethod.PUT, path: ''};
const CreateRole: IRoute<IRole, {created: IRole}, void> = {method: ERouteMethod.POST, path: ''};
const DeleteRole: IRoute<void, {changed: string}, {roleId: string, changeRoleTo: string}> = {method: ERouteMethod.DELETE, path: ''};

export const RoleControllerData: ControllerData = {
    basepath: "role", name: "Role", routes: [GetRoles, SetRole, CreateRole, DeleteRole]
}
