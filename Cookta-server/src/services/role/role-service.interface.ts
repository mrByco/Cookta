import {IRole} from "cookta-shared/src/models/roles/role.interface";

export interface IRoleService {
    GetRoles(): IRole[];
    GetRole(id: string): IRole;
}
