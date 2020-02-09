import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuMealingComponent } from './menu-mealing.component';

describe('MenuMealingComponent', () => {
  let component: MenuMealingComponent;
  let fixture: ComponentFixture<MenuMealingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuMealingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuMealingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
