import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyEditPageComponent } from './family-edit-page.component';

describe('FamilyEditPageComponent', () => {
  let component: FamilyEditPageComponent;
  let fixture: ComponentFixture<FamilyEditPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyEditPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
