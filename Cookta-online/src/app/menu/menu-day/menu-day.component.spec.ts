import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDayComponent } from './menu-day.component';

describe('MenuDayComponent', () => {
  let component: MenuDayComponent;
  let fixture: ComponentFixture<MenuDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
