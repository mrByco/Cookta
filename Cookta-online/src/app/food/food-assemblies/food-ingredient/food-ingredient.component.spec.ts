import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodIngredientComponent } from './food-ingredient.component';

describe('FoodIngredientComponent', () => {
  let component: FoodIngredientComponent;
  let fixture: ComponentFixture<FoodIngredientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodIngredientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodIngredientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
