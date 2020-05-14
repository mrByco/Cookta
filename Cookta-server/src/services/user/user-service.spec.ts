import {UserService} from "./user-service";
import * as chai from 'chai';
import {User} from "../../models/user.model";
chai.use(require('chai-spies'));
let expect = chai.expect;

describe('User service', () => {
    let service: UserService;

    beforeEach(() => {
       service = new UserService(id => new User(id), undefined);
    });

    it('should create', function () {
        expect(service).to.be.ok;
    });

    describe('Change role', () => {

        it('should throw if no user with sub', function (){
            // @ts-ignore
            service.Items = [];
            let error;
            try {
                service.ChangeRole('sub1', 'newRoleId');
            }
            catch (e){
                error = e;
            }
            expect(error).to.be.ok;
        });

        beforeEach(() => {
            // @ts-ignore
            service.Items = [{sub: 'sub1', role: 'oldRoleId'}];
            service.SaveItem = () => Promise.resolve();
            chai.spy.on(service, 'SaveItem');

        });

        it('should apply new role to item role', function () {
            service.ChangeRole('sub1', 'newRoleId');

            let user = service.FindOne(u => u.sub == 'sub1');
            expect(user.role).to.be.eql('newRoleId');
        });

        it('should call save function', function (){
            service.ChangeRole('sub1', 'newRoleId');

            expect(service.SaveItem).to.have.been.called();
        });
    });


});
