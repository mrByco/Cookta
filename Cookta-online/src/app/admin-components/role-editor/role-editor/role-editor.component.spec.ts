import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleEditorComponent } from './role-editor.component';
import {IRole} from "../../../../../../Cookta-shared/src/models/roles/role.interface";
import {RoleService} from "../../../shared/services/role-service/role.service";
import {By} from "@angular/platform-browser";

class MockRoleService {
  roles: IRole[];
  ReloadRoles(){};
}

describe('RoleEditorComponent', () => {
  let component: RoleEditorComponent;
  let fixture: ComponentFixture<RoleEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleEditorComponent ],
      providers: [{provide: RoleService, useClass: MockRoleService}]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleEditorComponent);
    component = fixture.componentInstance;
    spyOn(component.roleService, 'ReloadRoles');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should call reload roles', function () {

    expect(component.roleService.ReloadRoles).toHaveBeenCalled();
  });

  it('should display loading unil the service load', function () {
    component.roleService.roles = undefined;

    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#loading')).toBeTruthy();
  });


  describe('On filled with data', () => {
    beforeEach(() => {
      component.roleService.roles = [{roleID: 'id1', displayName: 'role1', permissions: ['perm1']}];
      fixture.detectChanges();
    });

    it('should display roles if they loaded', function () {
      let roles = fixture.nativeElement.querySelector('#roleList');
      expect(roles).toBeTruthy();
      expect(roles.textContent).toContain('role1');
    });

    describe('On item selected', () => {
      beforeEach(async () => {
        let roles = fixture.nativeElement.querySelector('#roleList');
        let role = roles.querySelector('a');
        role.click();
        await fixture.whenStable();
        fixture.detectChanges();
      })

      it('should display role title if we click in it', function () {
        expect(fixture.nativeElement.querySelector('#roleProperties').textContent).toContain('role1')
      });
      it('should display role permissions', function () {
        expect(fixture.nativeElement.querySelector('#roleProperties').textContent).toContain('perm1')
      });
    });
  });
});
