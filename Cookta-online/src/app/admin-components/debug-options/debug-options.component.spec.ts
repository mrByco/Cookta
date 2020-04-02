import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugOptionsComponent } from './debug-options.component';

describe('DebugOptionsComponent', () => {
  let component: DebugOptionsComponent;
  let fixture: ComponentFixture<DebugOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebugOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
