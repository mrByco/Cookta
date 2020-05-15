import {UserController} from "./user.controller";
import {Services} from "../../Services";
import {expect} from 'chai';


describe('User controller', () => {
   let controller: UserController;

   beforeEach(() => {
      controller = new UserController();
   });

    it('should created', function () {
        expect(controller).to.be.ok;
    });

    describe('Get all user', () => {
        it('should return user list with all users', async function () {
            let exampleUsers = [{username: 'username', email: 'email', profilpic: '', ToExtendedUser: () => {return {extendedUser: true}}}];
            // @ts-ignore
            Services.UserService = {}
            // @ts-ignore
            Services.UserService.GetAllItems = () => exampleUsers;

            let response = await controller.GetAllUser(null, null);

            expect(response).to.be.eql([{extendedUser: true}]);
        });
    });

    describe('Edit user', () => {
        it('should call change role and return result', async function () {
            let exampleUser = {username: 'username', email: 'email', profilpic: '', role: undefined,
                ToExtendedUser: () => {return exampleUser}};

            Services.RoleService = {GetRole: (id: string) => {return {}} } as any;
            // @ts-ignore
            Services.UserService = {}
            // @ts-ignore
            Services.UserService.ChangeRole = (primarySub: string, role: string) => {
                Object.assign(exampleUser, {role: role});
            };
            Services.UserService.FindOne = () =>  exampleUser as any;
            let roleId = 'Role';

            let response = await controller.EditUser({primarySub: "sub", roleId: "Role"}, null);

            exampleUser.role = roleId;

            expect(response).to.be.eql(exampleUser);
        });
    });
});
