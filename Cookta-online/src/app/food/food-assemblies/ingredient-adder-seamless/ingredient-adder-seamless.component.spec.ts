import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IngredientAdderSeamlessComponent} from './ingredient-adder-seamless.component';
import {MockUnitService} from '../../../shared/services/unit-service/unit.service.mock';
import {MockIngredientService} from '../../../shared/services/ingredient-service/ingredient.service.mock';
import {IngredientService} from '../../../shared/services/ingredient-service/ingredient.service';
import {UnitService} from '../../../shared/services/unit-service/unit.service';
import {FormsModule} from '@angular/forms';
import {IIngredient} from '../../../shared/models/grocery/ingredient.interface';


describe('IngredientAdderSeamlessComponent', () => {
  // noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
  const KeypressEventEnter = {
    AT_TARGET: 0,
    BUBBLING_PHASE: 0,
    CAPTURING_PHASE: 0,
    DOM_KEY_LOCATION_LEFT: 0,
    DOM_KEY_LOCATION_NUMPAD: 0,
    DOM_KEY_LOCATION_RIGHT: 0,
    DOM_KEY_LOCATION_STANDARD: 0,
    NONE: 0,
    altKey: false,
    bubbles: false,
    cancelBubble: false,
    cancelable: false,
    char: '',
    charCode: 0,
    composed: false,
    composedPath(): EventTarget[] {
      return [];
    },
    ctrlKey: false,
    currentTarget: undefined,
    defaultPrevented: false,
    detail: 0,
    eventPhase: 0,
    getModifierState(): boolean {
      return false;
    },
    initEvent(type: string, bubbles: boolean | undefined, cancelable: boolean | undefined): void {
    },
    isComposing: false,
    isTrusted: false,
    key: '',
    keyCode: 0,
    location: 0,
    metaKey: false,
    repeat: false,
    returnValue: false,
    shiftKey: false,
    srcElement: undefined,
    target: undefined,
    timeStamp: 0,
    type: '',
    view: undefined,
    which: 0,
    preventDefault(): void {
    },
    stopImmediatePropagation(): void {
    },
    stopPropagation(): void {
    },
    code: 'Enter'
  };
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

  it('Add ignredient fired correctly', () => {
    let ingredientType = mockIngredientService.GetRandomType();
    let unit = mockUnitService.GetRandomUnitOfIngredient(ingredientType);
    component.CurrentText = `${30} ${unit.name} ${ingredientType.name}`;
    let ingredient: IIngredient;
    component.OnIngredientAdded.subscribe(i => ingredient = i);

    component.onKeyDown(KeypressEventEnter);
    // noinspection JSUnusedAssignment
    expect(ingredient).toBeTruthy();
    // noinspection JSUnusedAssignment
    expect(ingredient.ingredientID).toBe(ingredientType.guid);
    // noinspection JSUnusedAssignment
    expect(ingredient.value).toBe(30);
    // noinspection JSUnusedAssignment
    expect(ingredient.unit).toBe(unit.id);
  });

});
