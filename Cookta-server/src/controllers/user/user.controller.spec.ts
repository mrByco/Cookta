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

    it('should return user list with all users', async function () {
        let exampleUsers = [{username: 'username', email: 'email', profilpic: '', ToExtendedUser: () => {return {extendedUser: true}}}];
        // @ts-ignore
        Services.UserService = {}
        // @ts-ignore
        Services.UserService.GetAllItems = () => exampleUsers;

        let response = await controller.GetAllUser();

        expect(response).to.be.eql([{extendedUser: true}]);
    });

});
