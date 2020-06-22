import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareHomeContentComponent } from './square-home-content.component';

describe('SquareHomeContentComponent', () => {
  let component: SquareHomeContentComponent;
  let fixture: ComponentFixture<SquareHomeContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SquareHomeContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SquareHomeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
