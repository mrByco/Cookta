import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPoolComponent } from './menu-pool.component';

describe('MenuPoolComponent', () => {
  let component: MenuPoolComponent;
  let fixture: ComponentFixture<MenuPoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuPoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
