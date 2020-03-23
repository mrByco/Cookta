import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyManagementComponent } from './family-management.component';

describe('FamilyManagementComponent', () => {
  let component: FamilyManagementComponent;
  let fixture: ComponentFixture<FamilyManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
