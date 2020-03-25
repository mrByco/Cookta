import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RootComponentComponent } from './root-component.component';

describe('RootComponentComponent', () => {
  let component: RootComponentComponent;
  let fixture: ComponentFixture<RootComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RootComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
