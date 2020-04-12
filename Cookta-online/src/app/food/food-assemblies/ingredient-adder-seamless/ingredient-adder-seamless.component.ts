import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {UnitService} from '../../../shared/services/unit.service';
import {IngredientService} from '../../../shared/services/ingredient.service';
import {Unit} from '../../../shared/models/unit.interface';
import {IngredientType} from '../../../shared/models/grocery/ingredient-type.model';
import {BsDropdownDirective} from 'angular-bootstrap-md';
import {IIngredient} from '../../../shared/models/grocery/ingredient.interface';

interface ISuggestion {
  type: ESuggestionType;
  text: string;
  value: any;
  action?: ESuggestionAction;
}

enum ESuggestionType {
  ingredient,
  unit
}

//TODO Refactor rename to Delete previous
enum ESuggestionAction {
  add,
  replace
}

@Component({
  selector: 'app-ingredient-adder-seamless',
  templateUrl: './ingredient-adder-seamless.component.html',
  styleUrls: ['./ingredient-adder-seamless.component.css']
})
export class IngredientAdderSeamlessComponent {

  @ViewChild('dropdown', {static: true}) public dropdown: BsDropdownDirective;
  @Output('OnIngredientAdded') public OnIngredientAdded: EventEmitter<IIngredient> = new EventEmitter<IIngredient>();

  public get CurrentText() {
    return this.m_CurrentText;
  }

  public set CurrentText(value: string) {
    this.m_CurrentText = value;

    this.RefreshSuggestionPool();
    this.FilterSuggestions();
  }

  public CursorPosition: number;

  private m_CurrentText: string;

  public CurrentSuggestionPool: ISuggestion[] = [];
  public CurrentSuggestions: ISuggestion[] = [];
  public SelectedSuggestionIndex: number = -1;


  constructor(public unitService: UnitService,
              public ingredientService: IngredientService) {
  }


  private parseCurrentIngredient(text: string): { value: number, ingredient: IngredientType, ingredientSuggestion: ISuggestion, unit: Unit, unitSuggestion: ISuggestion, unitValid: boolean, textLeft: string } {
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
      for (let unit of ValidUnits ? ValidUnits : []) {
        if (IngredientAdderSeamlessComponent.wordsIncludesText(t, unit.name.toLowerCase())) {
          unitSuggestion = {text: unit.name, type: ESuggestionType.unit, value: unit};
          break;
        }
        if (unit.shortname && IngredientAdderSeamlessComponent.wordsIncludesText(t, unit.shortname.toLowerCase())) {
          unitSuggestion = {text: unit.shortname, type: ESuggestionType.unit, value: unit};
          break;
        }
      }
    }
    let unitValid = true;
    if (!unitSuggestion) {
      unitSuggestion = this.CurrentSuggestionPool.find(s => s.type == ESuggestionType.unit && IngredientAdderSeamlessComponent.wordsIncludesText(t, s.text));
      if (unitSuggestion) {
        t = t.replace(unitSuggestion.text, '');
        unitValid = false;
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

  private onKeyDown(event: KeyboardEvent) {
    if (event.code == 'ArrowDown') {
      event.preventDefault();
      this.SelectedSuggestionIndex++;
    }
    if (event.code == 'ArrowUp') {
      event.preventDefault();
      this.SelectedSuggestionIndex--;
    }
    if (event.code == 'Enter') {
      let currentIngredient = this.parseCurrentIngredient(this.CurrentText);

      let addSuggestionToText = (sugg: ISuggestion) => {
        if (sugg.action == ESuggestionAction.replace) {
          //Work on private to avoid suggestion updates
          let prevElementText = sugg.type == ESuggestionType.unit ?
            currentIngredient.unitSuggestion.text :
            currentIngredient.ingredientSuggestion.text;

          this.m_CurrentText = this.CurrentText.replace(prevElementText, '');
          while (this.m_CurrentText.includes('  ')) {
            this.m_CurrentText.replace('  ', ' ');
          }
        }
        currentIngredient.textLeft.length == 0 ?
          this.CurrentText = (this.CurrentText[this.CurrentText.length - 1] == ' ' ? this.CurrentText + sugg.text : this.CurrentText + ' ' + sugg.text) :
          this.CurrentText = this.CurrentText.replace(currentIngredient.textLeft, sugg.text);
        this.SelectedSuggestionIndex = -1;
      };

      if (this.SelectedSuggestionIndex != -1 && this.CurrentSuggestions[this.SelectedSuggestionIndex]) {
        addSuggestionToText(this.CurrentSuggestions[this.SelectedSuggestionIndex]);
      } else if (currentIngredient.ingredient && currentIngredient.unit && currentIngredient.value) {
        this.OnIngredientAdded.emit({
          ingredientID: currentIngredient.ingredient.guid,
          value: currentIngredient.value,
          unit: currentIngredient.unit.id
        });
        this.CurrentText = '';

      } else if (this.CurrentSuggestions.length > 0) {
        for (let sugg of this.CurrentSuggestions) {
          if (!currentIngredient.ingredient && sugg.type == ESuggestionType.ingredient) {
            addSuggestionToText(sugg);
            break;
          } else if (!currentIngredient.unit && sugg.type == ESuggestionType.unit) {
            addSuggestionToText(sugg);
            break;
          }
        }
      }
    }
  }

  private RefreshSuggestionPool() {

    let suggestions: ISuggestion[] = [];

    for (let type of this.ingredientService.LastLoadedTypes.filter(i => !i['arhived'])) {
      suggestions.push({type: ESuggestionType.ingredient, text: type.displayName().toLowerCase(), value: type});
    }
    for (let unit of this.unitService.LastLoadedUnits.concat()) {

      if (!suggestions.find(u => u.text == unit.name)) {
        suggestions.push({type: ESuggestionType.unit, text: unit.name, value: unit});
      }
      if (unit.shortname && unit.shortname != '' && !suggestions.find(u => u.text == unit.shortname)) {
        suggestions.push({type: ESuggestionType.unit, text: unit.shortname, value: unit});
      }
    }
    this.CurrentSuggestionPool = suggestions.sort(this.compareISuggestions);
  }

  private FilterSuggestions() {

    let parseResult = this.parseCurrentIngredient(this.CurrentText);
    console.log(parseResult);

    let filterText = parseResult.textLeft;
    let filtered: ISuggestion[] = [];

    if (this.CurrentSuggestionPool.length > 0) {
      //ingredients
      if (!parseResult.ingredient) {
        if (filterText != '') {
          filtered.push(...this.CurrentSuggestionPool
            .filter(s => s.text.includes(filterText) && s.type == ESuggestionType.ingredient)
            .map<ISuggestion>((s) => {
              return {...s, ...{action: ESuggestionAction.add}};
            }));
        }
      } else {
        let secondWordIngOption = (s: ISuggestion) =>
          IngredientAdderSeamlessComponent.wordsIncludesText(s.text, parseResult.ingredientSuggestion.text + ' ' + filterText, true);

        let startsWithCurrent = (s: ISuggestion) =>
          IngredientAdderSeamlessComponent.startsWith(s.text, parseResult.ingredientSuggestion.text) && this.CurrentText[this.CurrentText.length - 1] != ' ';

        filtered.push(...this.CurrentSuggestionPool
          .filter(s => s.type == ESuggestionType.ingredient)
          .filter(s => startsWithCurrent(s) || secondWordIngOption(s))
          .map<ISuggestion>((s) => {
            return {...s, ...{action: ESuggestionAction.replace}};
          }));

        //units
        if (!parseResult.unit) {
          if (filterText != '') {
            filtered.push(...this.CurrentSuggestionPool
              .filter(s => s.text.includes(filterText) && s.type == ESuggestionType.unit)
              .map<ISuggestion>((s) => {
                return {...s, ...{action: ESuggestionAction.add}};
              }));
          }
        } else {
          let secondWordIngOption = (s: ISuggestion) =>
            IngredientAdderSeamlessComponent.wordsIncludesText(s.text, parseResult.unitSuggestion.text + ' ' + filterText, true);

          let startsWithCurrent = (s: ISuggestion) =>
            IngredientAdderSeamlessComponent.startsWith(s.text, parseResult.unitSuggestion.text) && this.CurrentText[this.CurrentText.length - 1] != ' ';

          filtered.push(...this.CurrentSuggestionPool
            .filter(s => s.type == ESuggestionType.unit)
            .filter(s => startsWithCurrent(s) || secondWordIngOption(s))
            .map<ISuggestion>((s) => {
              return {...s, ...{action: ESuggestionAction.replace}};
            }));
        }
      }
    }
    this.CurrentSuggestions = filtered.slice(0, 12);
    this.CurrentSuggestions.length > 0 ? this.dropdown.show() : this.dropdown.hide();
  }

  private static wordsIncludesText(searchIn: string, text: string, partial?: boolean): boolean {
    let words = searchIn.split(' ');
    let findWords: string[] = text.split(' ');
    for (let word of words) {
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
    }
    return false;
  }

  private static startsWith(str: string, startsWith: string) {
    return str.startsWith(startsWith) && startsWith.length > 0;
  }

  private compareISuggestions(a: ISuggestion, b: ISuggestion): number {
    let aLenght = a.text.split(' ').length;
    let bLenght = b.text.split(' ').length;
    if (aLenght == bLenght) {
      return 0;
    } else {
      return aLenght > bLenght ? -1 : 1;
    }
  }

  SelectionChanged(e: Event) {
    console.log(e);
  }
}
