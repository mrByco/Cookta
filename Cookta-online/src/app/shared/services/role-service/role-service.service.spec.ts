import { TestBed } from '@angular/core/testing';

import { RoleService } from './role.service';
import {ServerService} from "../server.service";
import {Observable} from "rxjs";
import {IRole} from "../../../../../../Cookta-shared/src/models/roles/role.interface";


describe('RoleService', () => {
  let service: RoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
          {provide: ServerService, useValue: new ServerService(null, null, null)}
          ]
    });
    service = TestBed.inject(RoleService);

  });

  describe('Can load roles', () => {
    beforeEach(() => {
      spyOn(service.serverService, 'GetRequest').and
          .returnValue(Promise.resolve(new Observable<IRole[]>(observer=> { observer.next([
            {roleID: 'id1', permissions: ['perm1'], displayName: 'name1'}
          ]);})))
    });
    it('should be created', () => {
      expect(service).toBeTruthy();

    });

    it('should load roles', async function () {
      await service.ReloadRoles();

      expect(service.roles).toBeTruthy();
    });

    it('should have roles null until load', async function () {
      expect(service.roles).toBeUndefined();

      let task = service.ReloadRoles();
      expect(service.roles).toBeUndefined();
      await task;
      expect(service.roles).not.toBeUndefined();

    });
  });

  describe('Throw error on load roles', () => {
    beforeEach(() => {
      spyOn(service.serverService, 'GetRequest').and
          .returnValue(Promise.resolve(new Observable<IRole[]>(observer=> { observer.error()})));
    });
    it('should Handle error', async function () {
      let error;
      try {
        await service.ReloadRoles();
      }catch (e){
        error = e;
      }
      expect(error).toBeFalsy();
    });
  });
});
