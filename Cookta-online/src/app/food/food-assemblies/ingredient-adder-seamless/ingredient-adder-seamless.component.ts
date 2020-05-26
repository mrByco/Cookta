import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Unit} from '../../../shared/models/unit.interface';
import {IngredientType} from '../../../shared/models/grocery/ingredient-type.model';
import {BsDropdownDirective} from 'angular-bootstrap-md';
import {IIngredient} from '../../../shared/models/grocery/ingredient.interface';
import {UnitService} from '../../../shared/services/unit-service/unit.service';
import {IngredientService} from '../../../shared/services/ingredient-service/ingredient.service';
import {IIngredientType} from "../../../shared/models/grocery/ingredient-type.interface";

interface ISuggestion {
  type: ESuggestionType;
  text: string;
  value: any;
  action?: ESuggestionAction;
}

interface IParseResult {
  value: number,
  ingredient: IngredientType,
  ingredientSuggestion: ISuggestion,
  unit: Unit,
  unitSuggestion: ISuggestion,
  unitValid: boolean,
  textLeft: string
}


enum ESuggestionType {
  ingredient,
  unit
}

enum ESuggestionAction {
  addToEnd,
  replaceOld
}

export enum EIngredientAdderState {
  empty,
  invalidUnit,
  ready,
  wip
}

@Component({
  selector: 'app-ingredient-adder-seamless',
  templateUrl: './ingredient-adder-seamless.component.html',
  styleUrls: ['./ingredient-adder-seamless.component.css']
})
export class IngredientAdderSeamlessComponent {

  public readonly ErrorUnitInvalid = 'A választott hozzávaló nem nem használható ennél a hozzávalónál válassz másikat.';
  public readonly SuccessText = 'Minden jónak tűnik, Enter megnyomásával hozzáadhatod a listához';
  public readonly LetsStartText = 'Hozzávaló pl: 85 dkg liszt';

  @ViewChild('dropdown', {static: true}) public dropdown: BsDropdownDirective;
  @ViewChild('input') public input: ElementRef;
  @Input('ShowTitleOnReady') public ShowTitleOnReady: boolean = true;
  @Output('OnIngredientAdded') public OnIngredientAdded: EventEmitter<IIngredient> = new EventEmitter<IIngredient>();

  public CurrentSuggestionPool: ISuggestion[] = [];
  public CurrentSuggestions: ISuggestion[] = [];
  public SelectedSuggestionIndex: number = -1;


  public CurrentState: EIngredientAdderState = EIngredientAdderState.empty;
  public CurrentType: IIngredientType;

  private m_CurrentText: string = '';

  constructor(public unitService: UnitService,
              public ingredientService: IngredientService) {
  }

  public get CurrentText() {
    return this.m_CurrentText;
  }

  public set CurrentText(value: string) {
    this.m_CurrentText = value;
    this.RefreshSuggestionPool();


    let parseResult = this.ParseText(value);
    this.CurrentType = parseResult.ingredient;
    this.UpdateState(parseResult, value);

    this.FilterSuggestions(parseResult);

    this.CurrentSuggestions.length > 0 && (this.CurrentState != EIngredientAdderState.ready || this.ShowTitleOnReady)? this.dropdown.show() : this.dropdown.hide();
  }

  private UpdateState(parseResult: IParseResult, currentText: string) {
    if (!currentText || currentText.length == 0) {
      this.CurrentState = EIngredientAdderState.empty;
    } else if (parseResult.ingredient && parseResult.unit && !parseResult.unitValid) {
      this.CurrentState = EIngredientAdderState.invalidUnit;
    } else if (parseResult.unit && parseResult.ingredient && parseResult.value && parseResult.unitValid) {
      this.CurrentState = EIngredientAdderState.ready;
    } else {
      this.CurrentState = EIngredientAdderState.wip;
    }
  }

  private static wordsIncludesText(searchIn: string, text: string, partial?: boolean, endWorld?: number): boolean {
    text = text.trim();
    let words = searchIn.split(' ');
    let findWords: string[] = text.split(' ');
    let wordIndex = 0;
    for (let word of words) {
      if (endWorld && wordIndex >= endWorld) {
        if (searchIn == 'kilogramm' && text == 'kilogramm') {
          console.log(wordIndex + '>=' + endWorld);
        }
        return false;
      }
      let index = 0;
      for (let find of findWords) {
        let currentContainerWord = words[words.indexOf(word) + index];
        //break if no next word
        if (!currentContainerWord) {
          break;
        }
        let includes: boolean = partial ? currentContainerWord.includes(find) : currentContainerWord != find;
        if (includes) {
          break;
        }
        index++;
      }
      if (index == findWords.length) {
        return true;
      }
      wordIndex++;
    }
    return false;
  }

  private static startsWith(str: string, startsWith: string) {
    return str.startsWith(startsWith) && startsWith.length > 0 && str != startsWith;
  }

  private static compareSuggestions(a: ISuggestion, b: ISuggestion): number {
    let aLenght = a.text.split(' ').length;
    let bLenght = b.text.split(' ').length;
    if (aLenght == bLenght) {
      return 0;
    } else {
      return aLenght > bLenght ? -1 : 1;
    }
  }

  public Focus(){
    this.input.nativeElement.focus();
  }

  public AddCurrentSelectedOrDefaultSuggestionToText(parseResult?: IParseResult, suggestion?: ISuggestion) {
    let sugg: ISuggestion;


    if (suggestion && this.CurrentSuggestions.includes(suggestion)) {
      sugg = suggestion;
    } else {
      sugg = this.CurrentSuggestions[this.SelectedSuggestionIndex < 0 ? 0 : this.SelectedSuggestionIndex];
    }


    parseResult = parseResult ? parseResult : this.ParseText(this.CurrentText);
    if (sugg.action == ESuggestionAction.replaceOld) {
      //Work on private to avoid suggestion updates
      let prevElementText = sugg.type == ESuggestionType.unit ?
        parseResult.unitSuggestion.text :
        parseResult.ingredientSuggestion.text;

      this.m_CurrentText = this.CurrentText.replace(prevElementText, sugg.text);
      while (this.m_CurrentText.includes('  ')) {
        this.m_CurrentText.replace('  ', ' ');
      }
      this.CurrentText = this.CurrentText.replace(parseResult.textLeft, '');
      return;
    }
    parseResult.textLeft.length == 0 ?
      this.CurrentText = (this.CurrentText[this.CurrentText.length - 1] == ' ' ? this.CurrentText + sugg.text : this.CurrentText + ' ' + sugg.text) :
      this.CurrentText = this.CurrentText.replace(parseResult.textLeft, sugg.text);
    this.SelectedSuggestionIndex = -1;
  }

  public onKeyDown(event: KeyboardEvent) {
    if (event.code == 'ArrowDown') {
      event.preventDefault();
      this.SelectedSuggestionIndex++;
    }
    if (event.code == 'ArrowUp') {
      event.preventDefault();
      this.SelectedSuggestionIndex--;
    }
    if (event.code == 'Enter' || event.code == 'Tab' || event.code == 'NumpadEnter') {
      let parseResult = this.ParseText(this.CurrentText);
      event.preventDefault();

      if (this.CurrentState == EIngredientAdderState.ready) {
        this.OnIngredientAdded.emit({
          ingredientID: parseResult.ingredient.guid,
          value: parseResult.value,
          unit: parseResult.unit.id
        });
        this.CurrentText = '';
      } else {
        this.AddCurrentSelectedOrDefaultSuggestionToText(parseResult);
      }
    }
  }

  public ParseText(text: string): IParseResult {
    let t = text.toLowerCase();

    //ingredient
    let ingredientSuggestion =
      this.CurrentSuggestionPool.find(s => s.type == ESuggestionType.ingredient && IngredientAdderSeamlessComponent.wordsIncludesText(t, s.text));
    if (ingredientSuggestion) {
      t = t.replace(ingredientSuggestion.text, '');
    }

    //unit
    let unitSuggestion: ISuggestion;
    if (ingredientSuggestion) {

      let ValidUnits = this.unitService.GetAvailableUnitsFor(ingredientSuggestion.value as IngredientType);
      for (let i = 0; i < t.split(' ').length; i++) {
        for (let unit of ValidUnits ? ValidUnits : []) {
          if (IngredientAdderSeamlessComponent.wordsIncludesText(t, unit.name.toLowerCase(), false)) {
            unitSuggestion = {text: unit.name, type: ESuggestionType.unit, value: unit};
            break;
          }
          if (unit.shortname && IngredientAdderSeamlessComponent.wordsIncludesText(t, unit.shortname.toLowerCase())) {
            unitSuggestion = {text: unit.shortname, type: ESuggestionType.unit, value: unit};
            break;
          }
        }
        if (unitSuggestion) {
          break;
        }
      }
    }
    let unitValid = true;
    if (!unitSuggestion) {

      for (let i = 0; i < t.split(' ').length; i++) {
        unitSuggestion = this.CurrentSuggestionPool.find(s =>
          s.type == ESuggestionType.unit &&
          IngredientAdderSeamlessComponent.wordsIncludesText(t, s.text, false, i));
        if (unitSuggestion) {
          break;
        }
      }
      if (unitSuggestion) {
        t = t.replace(unitSuggestion.text, '');
        unitValid = ingredientSuggestion == undefined;
      }
    }

    if (unitSuggestion) {
      t = t.replace(unitSuggestion.text, '');
    }

    //value
    let value;
    for (let str of t.split(' ')) {
      if (str == '') {
        continue;
      }
      let num = +(str.replace(',', '.'));
      if (isNaN(num)) {
        continue;
      }
      value = num;
      t = t.replace(str, '');
      break;
    }
    //Clean whitespace from start and end
    t = t.trim();
    return {
      value: value,
      ingredient: ingredientSuggestion ? ingredientSuggestion.value : undefined,
      ingredientSuggestion: ingredientSuggestion,
      unit: unitSuggestion ? unitSuggestion.value : undefined,
      unitSuggestion: unitSuggestion,
      unitValid: unitValid, textLeft: t
    };
  }

  private RefreshSuggestionPool() {

    let suggestions: ISuggestion[] = [];

    let customUnits: Unit[] = [];
    //ingredients
    for (let type of this.ingredientService.LastLoadedTypes) {
      suggestions.push({type: ESuggestionType.ingredient, text: type.displayName().toLowerCase(), value: type});
      if (type.options.cunits) {
        customUnits.push(...type.options.cunits);
      }
    }

    //units
    for (let unit of this.unitService.LastLoadedUnits.concat(customUnits)) {

      if (!suggestions.find(u => u.text == unit.name)) {
        suggestions.push({type: ESuggestionType.unit, text: unit.name, value: unit});
      }
      if (unit.shortname && unit.shortname != '' && !suggestions.find(u => u.text == unit.shortname)) {
        suggestions.push({type: ESuggestionType.unit, text: unit.shortname, value: unit});
      }
    }
    this.CurrentSuggestionPool = suggestions.sort(IngredientAdderSeamlessComponent.compareSuggestions);
  }

  private FilterSuggestions(parseResult: IParseResult) {

    if (this.CurrentState == EIngredientAdderState.ready) {
      this.CurrentSuggestions = [];
    } else {
      let filterText = parseResult.textLeft;
      let filtered: ISuggestion[] = [];

      if (this.CurrentSuggestionPool.length > 0) {
        //ingredients
        if (!parseResult.ingredient) {
          if (filterText != '' || parseResult.value && parseResult.unit) {
            filtered.push(...this.CurrentSuggestionPool
              .filter(s => s.text.includes(filterText) && s.type == ESuggestionType.ingredient)
              .map<ISuggestion>((s) => {
                return {...s, ...{action: ESuggestionAction.addToEnd}};
              }));
          }
        } else {

          let startsWithCurrent = (s: ISuggestion) =>
            IngredientAdderSeamlessComponent.startsWith(s.text, parseResult.ingredientSuggestion.text + filterText) && this.CurrentText[this.CurrentText.length - 1] != ' ';

          filtered.push(...this.CurrentSuggestionPool
            .filter(s => s.type == ESuggestionType.ingredient)
            .filter(s => startsWithCurrent(s))
            .map<ISuggestion>((s) => {
              return {...s, ...{action: ESuggestionAction.replaceOld}};
            }));
        }
        //units

        let validUnits: Unit[] = parseResult.ingredient ? this.unitService.GetAvailableUnitsFor(parseResult.ingredient) : undefined;
        let validUnitFilter = (u: ISuggestion) => validUnits ? validUnits.includes(u.value) : true;

        if (!parseResult.unit) {
          if (filterText != '' || parseResult.value || parseResult.ingredient) {
            filtered.push(...this.CurrentSuggestionPool
              .filter(validUnitFilter)
              .filter(s => s.text.includes(filterText) && s.type == ESuggestionType.unit)
              .map<ISuggestion>((s) => {
                return {...s, ...{action: ESuggestionAction.addToEnd}};
              }));
          }
        } else if (this.CurrentState == EIngredientAdderState.invalidUnit) {

          let startsWithCurrent = (s: ISuggestion) =>
            IngredientAdderSeamlessComponent.startsWith(s.text, parseResult.unitSuggestion.text + filterText) &&
            this.CurrentText[this.CurrentText.length - 1] != ' ';

          filtered.push(...this.CurrentSuggestionPool
            .filter(validUnitFilter)
            .filter(s => s.type == ESuggestionType.unit)
            .map<ISuggestion>((s) => {
              return {...s, ...{action: ESuggestionAction.replaceOld}};
            }));

          console.log(validUnits);
          console.log(filtered.length);
        } else {
          filtered.push(...this.CurrentSuggestionPool
            .filter(s => validUnitFilter(s))
            .map<ISuggestion>((s) => {
              return {...s, ...{action: ESuggestionAction.replaceOld}};
            }));
        }
      }
      this.CurrentSuggestions = filtered.slice(0, 12);
    }
  }
}
