import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IngredientAdderSeamlessComponent} from './ingredient-adder-seamless.component';
import {MockUnitService} from '../../../shared/services/unit-service/unit.service.mock';
import {MockIngredientService} from '../../../shared/services/ingredient-service/ingredient.service.mock';
import {IngredientService} from '../../../shared/services/ingredient-service/ingredient.service';
import {UnitService} from '../../../shared/services/unit-service/unit.service';
import {FormsModule} from '@angular/forms';

describe('IngredientAdderSeamlessComponent', () => {
  let component: IngredientAdderSeamlessComponent;
  let mockUnitService: MockUnitService = new MockUnitService();
  let mockIngredientService: MockIngredientService = new MockIngredientService();
  let fixture: ComponentFixture<IngredientAdderSeamlessComponent>;

  const DropdownChild = jasmine.createSpyObj('dropdown', ['hide']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [IngredientAdderSeamlessComponent],
      providers: [
        {provide: IngredientService, useValue: mockIngredientService},
        {provide: UnitService, useValue: mockUnitService}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientAdderSeamlessComponent);

    component = fixture.componentInstance;
    component.dropdown = DropdownChild;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('parse ingredient', () => {
    let ingredientType = mockIngredientService.GetRandomType();
    let unit = mockUnitService.GetRandomUnitOfIngredient(ingredientType);
    component.CurrentText = `${30} ${unit.name} ${ingredientType.name}`;
    let parseResult = component.ParseText(component.CurrentText);
    expect(parseResult.ingredient).toBe(ingredientType);
    expect(parseResult.value).toBe(30);
    expect(parseResult.unit).toBe(unit);
  });
});
