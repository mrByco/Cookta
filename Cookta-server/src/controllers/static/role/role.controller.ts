import {Controller} from 'waxen/src/deorators/controller';
import {Contracts} from 'cookta-shared/src/contracts/contracts';
import {IRole} from 'cookta-shared/src/models/roles/role.interface';
import {Services} from '../../../Services';
import {Security} from 'waxen/src/deorators/security';
import {User} from '../../../models/user.model';

@Controller(Contracts.Roles)
export class RoleController {
    @Security(false, 'manage-roles')
    public async GetRoles(reqBody: void, user: User): Promise<IRole[]> {
        return Services.RoleService.GetRoles();
    }

    /** TODO This method is auto generated by waxen generator. Please end it. */
    public async SetRole(reqBody: IRole): Promise<{ success: boolean, edited: IRole }> {
        throw new Error('Route SetRole is not implemented');
    }

    /** TODO This method is auto generated by waxen generator. Please end it. */
    public async CreateRole(reqBody: IRole): Promise<{ created: IRole }> {
        throw new Error('Route CreateRole is not implemented');
    }

    /** TODO This method is auto generated by waxen generator. Please end it. */
    public async DeleteRole(reqBody: void, roleId: string, changeRoleTo: string): Promise<{ changed: string }> {
        throw new Error('Route DeleteRole is not implemented');
    }
}
