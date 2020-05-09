import { TestBed } from '@angular/core/testing';

import { RoleService } from './role.service';

describe('RoleService', () => {
  let service: RoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers
    });
    service = TestBed.inject(RoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load roles', async function () {
    await service.ReloadRoles();

    expect(service.roles).toBeTruthy();
  });

  it('should have roles null until load', async function () {
    expect(service.roles).toBeNull();

    let task = service.ReloadRoles();
    expect(service.roles).toBeNull();
    await task;
    expect(service.roles).not.toBeNull();

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
