import {RoleController} from "./role.controller";
import {expect} from 'chai';
import {Services} from "../../Services";
import {IRoleService} from "../../services/role/role-service.interface";
import {IRole} from "cookta-shared/src/models/roles/role.interface";
import {GetSampleRoles} from "../../sample.data";

class MockRoleService implements IRoleService{
    GetRoles(): IRole[] {
        return GetSampleRoles();
    }

}


describe('Role controller', () => {
    let controller: RoleController;
   beforeEach(() => {
       controller = new RoleController();
   });

    it('should controller created', function () {
        expect(controller).to.be.ok;
    });

    it('should have functions', function () {
        expect(typeof(controller.GetRoles)).to.be.equals('function');
        expect(typeof(controller.CreateRole)).to.be.equals('function');
        expect(typeof(controller.SetRole)).to.be.equals('function');
        expect(typeof(controller.DeleteRole)).to.be.equals('function');
    });

    describe('Get roles', () => {
        //Create service mock
       beforeEach(() => {
           Services.RoleService = new MockRoleService();
       })

        it('should should return roles', async function () {
            expect(await controller.GetRoles()).to.have.members;
            //expect(await controller.GetRoles()).to.have.members;
        });

    });



});
