
import {UserService} from "./user.service";
import {ServerService} from "../server.service";
import {Observable} from "rxjs";


describe('User.ServiceService', () => {
  let service: UserService;
  let FakeServerService;

  beforeEach(() => {
    FakeServerService = {
      GetRequest: () => {},
      PutRequest: () => {},
    }
    service = new UserService(FakeServerService as any as ServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('with users already loaded', () => {
    beforeEach(() => {
      service.Users = [];
    });

    it('should have users undefined on load', async function () {
      let sampleUsers = [];

      spyOn(FakeServerService, 'GetRequest').and.returnValue(Promise.resolve(new Observable(o => o.next(sampleUsers))))

      let task = service.ReloadUsers();
      expect(service.Users).toBeUndefined();
      await task;
      expect(service.Users).toBe(sampleUsers);
    });

    it('should Handle error with set users to null', async function () {
      spyOn(FakeServerService, 'GetRequest').and.returnValue(Promise.resolve(new Observable(o => o.error('Errrr'))));

      await service.ReloadUsers();
      expect(service.Users).toBe(null);
    });

    describe('Change user role', function () {
      beforeEach(function() {
        service.Users = [{sub: 'userSub1', role: 'roleId1'} as any]
        spyOn(FakeServerService, 'PutRequest').and
            .returnValue(Promise.resolve(new Observable(o => o.next({role: 'roleId2'}))));
      });

      it('should make put request on change role', async function () {

        await service.ChangeUserRole('userSub1', 'roleId1');

        expect(FakeServerService.PutRequest).toHaveBeenCalled();
      });

      it('should return information in the same object if user is already loaded', async function() {
        let user = service.Users.find(u => u.sub == 'userSub1');

        await service.ChangeUserRole('userSub1', 'roleId2');

        expect(user.role).toEqual('roleId2');
      });

      it('should make user null during loading', async function() {
        let user = service.Users.find(u => u.sub == 'userSub1');

        let task = service.ChangeUserRole('userSub1', 'roleId2');

        expect(user.role).toBeNull();

        await task;

        expect(user.role).toBeTruthy();
      });

    });

  })

});
