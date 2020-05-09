import {StoreService} from "atomik/lib/store-service/store-service";
import {Role} from "../../models/role.model";
import {IRoleService} from "./role-service.interface";
import {IRole} from "cookta-shared/src/models/roles/role.interface";

export class RoleService extends StoreService<Role> implements IRoleService{
    GetRole(id: string) {
        return this.FindOne(r => r.roleID == id);
    }

    GetRoles(): IRole[] {
        return this.Items;
    }

}
