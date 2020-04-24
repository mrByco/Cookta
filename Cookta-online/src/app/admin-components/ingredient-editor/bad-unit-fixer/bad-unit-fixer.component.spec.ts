import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BadUnitFixerComponent} from './bad-unit-fixer.component';

describe('BadUnitFixerComponent', () => {
  let component: BadUnitFixerComponent;
  let fixture: ComponentFixture<BadUnitFixerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BadUnitFixerComponent]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BadUnitFixerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
