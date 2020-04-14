import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientAdderSeamlessComponent } from './ingredient-adder-seamless.component';

describe('IngredientAdderSeamlessComponent', () => {
  let component: IngredientAdderSeamlessComponent;
  let fixture: ComponentFixture<IngredientAdderSeamlessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientAdderSeamlessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientAdderSeamlessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
