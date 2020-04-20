import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IngredientAdderSeamlessComponent} from './ingredient-adder-seamless.component';
import {MockUnitService} from '../../../shared/services/unit-service/unit.service.mock';
import {MockIngredientService} from '../../../shared/services/ingredient-service/ingredient.service.mock';
import {IngredientService} from '../../../shared/services/ingredient-service/ingredient.service';
import {UnitService} from '../../../shared/services/unit-service/unit.service';
import {FormsModule} from '@angular/forms';
import {IIngredient} from '../../../shared/models/grocery/ingredient.interface';
import {Unit} from '../../../shared/models/unit.interface';




describe('IngredientAdderSeamlessComponent', () => {
  // noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
  const KeypressEventBasic: any = {
    DOM_KEY_LOCATION_JOYSTICK: 0,
    DOM_KEY_LOCATION_MOBILE: 0,
    initKeyboardEvent(typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, viewArg: Window, keyArg: string, locationArg: number, modifiersListArg: string, repeat: boolean, locale: string): void {
    },
    initUIEvent(typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, viewArg: Window, detailArg: number): void {
    },
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
    code: ''
  };

  let component: IngredientAdderSeamlessComponent;
  let mockUnitService: MockUnitService = new MockUnitService();
  let mockIngredientService: MockIngredientService = new MockIngredientService();
  let fixture: ComponentFixture<IngredientAdderSeamlessComponent>;

  const DropdownChild = jasmine.createSpyObj('dropdown', ['hide', 'show']);

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

    component.onKeyDown({...KeypressEventBasic, ...{code: 'Enter'}});
    // noinspection JSUnusedAssignment
    expect(ingredient).toBeTruthy();
    // noinspection JSUnusedAssignment
    expect(ingredient.ingredientID).toBe(ingredientType.guid);
    // noinspection JSUnusedAssignment
    expect(ingredient.value).toBe(30);
    // noinspection JSUnusedAssignment
    expect(ingredient.unit).toBe(unit.id);
  });

  it('Check it shows the an ingredient corrently by name (with complete unit)', () => {
    let ingredientType = mockIngredientService.GetRandomType();
    let unit = mockUnitService.GetRandomUnitOfIngredient(ingredientType);
    component.CurrentText = `${30} ${unit.name} ${ingredientType.name.slice(0, -1)}`;

    let suggestionOfIngredient = component.CurrentSuggestions.find(i => i.value == ingredientType);
    expect(suggestionOfIngredient).toBeTruthy();
  });

  it('Check it shows the an ingredient corrently by name (without unit)', () => {
    let ingredientType = mockIngredientService.GetRandomType();
    component.CurrentText = `${30} ${ingredientType.name.slice(0, -1)}`;

    let suggestionOfIngredient = component.CurrentSuggestions.find(i => i.value == ingredientType);
    expect(suggestionOfIngredient).toBeTruthy();
  });

  it('Complete suggestion if not selected', () => {
    let ingredientType = mockIngredientService.GetRandomType();
    component.CurrentText = `${30} ${ingredientType.name.slice(0, 1)}`;

    let expectedSuggestion = component.CurrentSuggestions[0];

    component.onKeyDown({...KeypressEventBasic, ...{code: 'Enter'}});

    expect(component.CurrentText).toBe(`30 ${expectedSuggestion.text}`);
  });

  it('Complete suggestion selected second by keypress', () => {
    let ingredientType = mockIngredientService.GetRandomType();
    component.CurrentText = `${30} ${ingredientType.name.slice(0, 1)}`;

    let expectedSuggestion = component.CurrentSuggestions[1];

    component.onKeyDown({...KeypressEventBasic, ...{code: 'ArrowDown'}});
    component.onKeyDown({...KeypressEventBasic, ...{code: 'ArrowDown'}});
    component.onKeyDown({...KeypressEventBasic, ...{code: 'ArrowDown'}});
    component.onKeyDown({...KeypressEventBasic, ...{code: 'ArrowUp'}});

    component.onKeyDown({...KeypressEventBasic, ...{code: 'Enter'}});

    expect(component.CurrentText).toBe(`30 ${expectedSuggestion.text}`);
  });

  it('Check invalid unit state', () => {
    let ingredientType = mockIngredientService.GetRandomType();
    let availableUnits = mockUnitService.GetAvailableUnitsFor(ingredientType);
    let invalidUnit = mockUnitService.LastLoadedUnits.find(i => !availableUnits.includes(i));
    component.CurrentText = `${30} ${invalidUnit.name} ${ingredientType.name}`;

    expect(component.ParseText(component.CurrentText).unitValid).toBeFalsy();
  });

  it('Should suggest only valid ingredients', () => {

    component.CurrentText = '30 liter liszt';
    let parseResult = component.ParseText(component.CurrentText);
    expect(parseResult.ingredient).toBeTruthy();

    let validUnits = mockUnitService.GetAvailableUnitsFor(parseResult.ingredient);
    let invalidUnits = mockUnitService.LastLoadedUnits.filter(u => !validUnits.includes(u));

    let invalidSuggestion = component.CurrentSuggestions.find(s => invalidUnits.find(u => u == s.value));
    expect(invalidSuggestion).toBeFalsy();
  });

  it('Select a suggestion for replace', () => {
    let ingredientType = mockIngredientService.GetRandomType();
    let availableUnits = mockUnitService.GetAvailableUnitsFor(ingredientType);
    let invalidUnit = mockUnitService.LastLoadedUnits.find(i => !availableUnits.includes(i));

    component.CurrentText = `${30} ${invalidUnit.name} ${ingredientType.name}`;

    let SelectedSuggestionUnit = component.CurrentSuggestions[0].value as Unit;


    component.onKeyDown({...KeypressEventBasic, ...{code: 'Enter'}});

    expect(component.CurrentText).toBe(`${30} ${SelectedSuggestionUnit.name} ${ingredientType.name}`);
  });

  it('Display helper text if ingredient complete but unit invalid', () => {
    component.CurrentText = '30 liter liszt';

    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain(component.ErrorUnitInvalid);
  });

  it('Display ok text if ingredient complete & valid', () => {
    component.CurrentText = `30 dkg liszt`;

    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain(component.SuccessText);
  });

  it('Display start on start', () => {
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain(component.LetsStartText);
  });

  it('Display start if set empty', () => {
    component.CurrentText = ``;
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain(component.LetsStartText);
  });
});
