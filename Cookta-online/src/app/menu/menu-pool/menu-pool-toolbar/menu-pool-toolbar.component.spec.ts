import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPoolToolbarComponent } from './menu-pool-toolbar.component';

describe('MenuPoolToolbarComponent', () => {
  let component: MenuPoolToolbarComponent;
  let fixture: ComponentFixture<MenuPoolToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuPoolToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPoolToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
