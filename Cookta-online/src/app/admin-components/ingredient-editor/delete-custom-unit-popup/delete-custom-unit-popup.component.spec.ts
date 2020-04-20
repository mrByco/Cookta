import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCustomUnitPopupComponent } from './delete-custom-unit-popup.component';

describe('DeleteCustomUnitPopupComponent', () => {
  let component: DeleteCustomUnitPopupComponent;
  let fixture: ComponentFixture<DeleteCustomUnitPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteCustomUnitPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCustomUnitPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
