import {async, ComponentFixture, TestBed, tick} from '@angular/core/testing';

import {UserListComponent} from './user-list.component';
import {UserService} from "../../shared/services/user-service/user.service";
import {RoleService} from "../../shared/services/role-service/role.service";
import {IRole} from '../../../../../Cookta-shared/src/models/roles/role.interface';

describe('UserListComponent', () => {
    let component: UserListComponent;
    let fixture: ComponentFixture<UserListComponent>;

    const FillComponentWithData = (UserListComponent, fixture) => {
        component.userService.Users = [{username: 'SampleUser', email: 'matyi', role: 'testrole', sub: 'sub1'}] as any[];
        fixture.detectChanges();
    }
    const SelectAUser = async (fixture) => {
        let users = fixture.nativeElement.querySelector('#userlist');
        let user = users.querySelector('a');
        user.click();
        await fixture.whenStable();
        fixture.detectChanges();
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserListComponent],
            providers: [
                { provide: UserService, useValue: { ReloadUsers: () => {}, ChangeUserRole: () => {}}},
                { provide: RoleService, useValue: {
                        GetRoleById: () => {
                            return {displayName: 'testRole1'} as IRole
                        },
                        ReloadRoles: () => {},
                        roles: [{displayName: 'testRole1', roleID: 'roleID1'},{displayName: 'testRole2', roleID: 'roleID2'}]
                    }
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

    describe('List users', function () {
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
                FillComponentWithData(component, fixture);
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

    describe('Modify user', function () {
        beforeEach(() => {
            FillComponentWithData(component, fixture);
        });

        describe('Change user role', function () {

            it('should call change role request', async function () {
                await SelectAUser(fixture);
                spyOn(component.userService, 'ChangeUserRole');

                const select: HTMLSelectElement = fixture.nativeElement.querySelector('#roleSelect');
                component.select = select;
                const indexToSelect = component.roleService.roles.findIndex(r => r.roleID == 'roleID2')
                select.value = select.options[indexToSelect].value;
                select.dispatchEvent(new Event('change'));
                fixture.detectChanges();
                await fixture.whenStable();

                let selectRole = component.roleService.roles.find(r => r.roleID == 'roleID2');
                expect(component.userService.ChangeUserRole).toHaveBeenCalledWith('sub1', selectRole.roleID);
            });

        });


    });

});
