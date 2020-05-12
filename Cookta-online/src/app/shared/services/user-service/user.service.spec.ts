import { TestBed } from '@angular/core/testing';
import {UserService} from "./user.service";
import {ServerService} from "../server.service";
import {Observable} from "rxjs";
import {sample} from "rxjs/operators";


describe('User.ServiceService', () => {
  let service: UserService;
  let FakeServerService;

  beforeEach(() => {
    FakeServerService = {
      GetRequest: () => {},
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
  })

});
