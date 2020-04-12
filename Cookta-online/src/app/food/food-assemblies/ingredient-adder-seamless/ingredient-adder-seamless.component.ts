import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {UnitService} from '../../../shared/services/unit.service';
import {IngredientService} from '../../../shared/services/ingredient.service';
import {Unit} from '../../../shared/models/unit.interface';
import {IngredientType} from '../../../shared/models/grocery/ingredient-type.model';
import {BsDropdownDirective} from 'angular-bootstrap-md';
import {IDisplayable} from '../../../utilities/displayable';
import {throwError} from 'rxjs';

interface ISuggestion {
  type: SuggestionType;
  text: string;
  value: any;
}

enum SuggestionType {
  ingredient,
  unit
}

@Component({
  selector: 'app-ingredient-adder-seamless',
  templateUrl: './ingredient-adder-seamless.component.html',
  styleUrls: ['./ingredient-adder-seamless.component.css']
})
export class IngredientAdderSeamlessComponent {


  public get CurrentText() {
    return this.m_CurrentText;
  }

  public set CurrentText(value: string) {
    this.m_CurrentText = value;
    if (value[value.length - 1] == ' ') {
    }
    ;

    this.RefreshSuggestionPool();
    this.FilterSuggestions();
  }

  private m_CurrentText;

  public CurrentSuggestionPool: ISuggestion[] = [];
  public CurrentSuggestions: ISuggestion[] = [];

  @ViewChild('dropdown', {static: true}) public dropdown: BsDropdownDirective;


  private ValidatedPrefix = '';

  private getCurrentIngredient(text: string): { value: number, ingredient: IngredientType, unit: Unit, unitValid: boolean, textLeft: string } {
    let t = text.toLowerCase();

    //ingredient
    let ingredientSuggestion =
      this.CurrentSuggestionPool.sort(this.compareISuggestions).find(s => s.type == SuggestionType.ingredient && this.WordsContainsText(t.split(' '), s.text));
    if (ingredientSuggestion) {
      t = t.replace(ingredientSuggestion.text, '');
    }

    //unit
    let unitSuggestion: ISuggestion;
    if (ingredientSuggestion) {

      let ValidUnits = this.unitService.GetAvailableUnitsFor(ingredientSuggestion.value as IngredientType);
      for (let unit of ValidUnits ? ValidUnits : []) {
        if (t.includes(unit.name.toLowerCase())) {
          unitSuggestion = {text: unit.name, type: SuggestionType.unit, value: unit};
          break;
        }
        if (unit.shortname && t.includes(unit.shortname.toLowerCase())) {
          unitSuggestion = {text: unit.shortname, type: SuggestionType.unit, value: unit};
          break;
        }
      }
    }
    let unitValid = true;
    if (!unitSuggestion) {
      unitSuggestion = this.CurrentSuggestionPool.find(s => s.type == SuggestionType.unit && t.split(' ').includes(s.text));
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
      unit: unitSuggestion ? unitSuggestion.value : undefined,
      unitValid: unitValid, textLeft: t
    };
  }

  public SelectedSuggestionIndex: number = -1;

  constructor(public unitService: UnitService,
              public ingredientService: IngredientService) {
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.code == 'ArrowDown') {
      event.preventDefault();
      this.SelectedSuggestionIndex++;
    }
    if (event.code == 'ArrowUp') {
      event.preventDefault();
      this.SelectedSuggestionIndex--;
    }
    if (event.code == 'Enter') {
      if (this.SelectedSuggestionIndex != -1 && this.CurrentSuggestions[this.SelectedSuggestionIndex]) {
        let ingredient = this.getCurrentIngredient(this.CurrentText);
        this.CurrentText = this.CurrentText.replace(ingredient.textLeft, this.CurrentSuggestions[this.SelectedSuggestionIndex].text);
        this.SelectedSuggestionIndex = -1;
      }

    }
  }

  private RefreshSuggestionPool() {

    let suggestions: ISuggestion[] = [];

    for (let type of this.ingredientService.LastLoadedTypes.filter(i => !i['arhived'])) {
      suggestions.push({type: SuggestionType.ingredient, text: type.displayName().toLowerCase(), value: type});
    }
    for (let unit of this.unitService.LastLoadedUnits.concat()) {

      if (!suggestions.find(u => u.text == unit.name)) {
        suggestions.push({type: SuggestionType.unit, text: unit.name, value: unit});
      }
      if (unit.shortname && unit.shortname != '' && !suggestions.find(u => u.text == unit.shortname)) {
        suggestions.push({type: SuggestionType.unit, text: unit.shortname, value: unit});
      }
    }
    this.CurrentSuggestionPool = suggestions;
  }

  private FilterSuggestions() {

    let currentIng = this.getCurrentIngredient(this.CurrentText);
    console.log(currentIng);

    let current = this.getCurrentIngredient(this.CurrentText);
    let filterText = current.textLeft;
    let filtered = [];
    if (this.CurrentSuggestionPool.length > 0) {
      filtered = (this.CurrentSuggestionPool as ISuggestion[]).filter((sugg) => sugg.text.includes(filterText));
    }

    this.CurrentSuggestions = filtered.slice(0, 12);
    this.CurrentSuggestions.length > 0 ? this.dropdown.show() : this.dropdown.hide();
  }

  private WordsContainsText(words: string[], text: string): boolean {
    if (text.includes(' ')) {
      let findWords: string[] = text.split(' ');
      for (let word of words) {
        let index = 0;
        for (let find of findWords) {
          if (words[words.indexOf(word) + index] != find) {
            break;
          }
          index++;
        }
        if (index == findWords.length) {
          return true;
        }
      }
    } else {
      return words.includes(text);
    }
    return false;
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

}
