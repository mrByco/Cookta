import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingListPanelComponent } from './shopping-list-panel.component';

describe('ShoppingListPanelComponent', () => {
  let component: ShoppingListPanelComponent;
  let fixture: ComponentFixture<ShoppingListPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingListPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingListPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
