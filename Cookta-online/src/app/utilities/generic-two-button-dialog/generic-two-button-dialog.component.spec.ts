import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTwoButtonDialogComponent } from './generic-two-button-dialog.component';

describe('GenericTwoButtonDialogComponent', () => {
  let component: GenericTwoButtonDialogComponent;
  let fixture: ComponentFixture<GenericTwoButtonDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericTwoButtonDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericTwoButtonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
