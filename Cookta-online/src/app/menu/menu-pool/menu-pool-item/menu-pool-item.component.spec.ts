import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPoolItemComponent } from './menu-pool-item.component';

describe('MenuPoolItemComponent', () => {
  let component: MenuPoolItemComponent;
  let fixture: ComponentFixture<MenuPoolItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuPoolItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPoolItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
