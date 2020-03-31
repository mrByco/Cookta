import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingListRootComponent } from './shopping-list-root.component';

describe('ShoppingListRootComponent', () => {
  let component: ShoppingListRootComponent;
  let fixture: ComponentFixture<ShoppingListRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingListRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingListRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
