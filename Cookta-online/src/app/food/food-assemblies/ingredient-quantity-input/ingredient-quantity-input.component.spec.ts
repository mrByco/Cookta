import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IngredientQuantityInputComponent} from './ingredient-quantity-input.component';

describe('IngredientQuantityInputComponent', () => {
  let component: IngredientQuantityInputComponent;
  let fixture: ComponentFixture<IngredientQuantityInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientQuantityInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientQuantityInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
