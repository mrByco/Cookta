import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyPickerComponent } from './family-picker.component';

describe('FamilyPickerComponent', () => {
  let component: FamilyPickerComponent;
  let fixture: ComponentFixture<FamilyPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
