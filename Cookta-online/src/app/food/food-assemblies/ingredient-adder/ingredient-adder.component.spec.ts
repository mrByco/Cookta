import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientAdderComponent } from './ingredient-adder.component';

describe('IngredientAdderComponent', () => {
  let component: IngredientAdderComponent;
  let fixture: ComponentFixture<IngredientAdderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientAdderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientAdderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
