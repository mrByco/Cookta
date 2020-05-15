import {async, ComponentFixture, TestBed, tick} from '@angular/core/testing';

import { UserListComponent } from './user-list.component';
import {UserService} from "../../shared/services/user-service/user.service";
import {RoleService} from "../../shared/services/role-service/role.service";
import { IRole } from '../../../../../Cookta-shared/src/models/roles/role.interface';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserListComponent ],
      providers: [
          {provide: UserService, useValue: {ReloadUsers: () => {}}},
          {provide: RoleService, useValue: {GetRoleById: () =>
              {
                return {displayName: 'testRole'} as IRole}, roles: [], ReloadRoles: () => {}}
          }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    spyOn(component.userService, 'ReloadUsers');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('List users', function() {
    it('should call reload users', function () {
      expect(component.userService.ReloadUsers).toHaveBeenCalled();
    });

    it('should display loading unil the service load', function () {
      component.userService.Users = undefined;

      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('#loading')).toBeTruthy();
    });
    
    describe('On filled with data', () => {
      beforeEach(() => {
        component.userService.Users = [{username: 'SampleUser', email: 'matyi', role: 'testrole'}] as any[];
        fixture.detectChanges();
      });

      it('should display roles if they loaded', function () {
        let users = fixture.nativeElement.querySelector('#userlist');
        expect(users).toBeTruthy();
        expect(users.textContent).toContain('matyi');
        expect(users.textContent).toContain('SampleUser');
      });

      describe('On item selected', () => {
        beforeEach(async () => {
          let users = fixture.nativeElement.querySelector('#userlist');
          let user = users.querySelector('a');
          user.click();
          await fixture.whenStable();
          fixture.detectChanges();
        })

        it('should display username if we click in it', function () {
          expect(fixture.nativeElement.querySelector('#userproperties').textContent).toContain('matyi')
        });

        it('should display role email', function () {
          expect(fixture.nativeElement.querySelector('#userproperties').textContent).toContain('SampleUser')
        });

        it('should display role name', function () {
          expect(fixture.nativeElement.querySelector('#userproperties').textContent).toContain('testRole');
        });
      });
    });
  });


});
