import {IngredientType} from '../../shared/models/grocery/ingredient-type.model';
import {Unit} from '../../shared/models/unit.interface';
import {EUnitType} from '../../shared/models/grocery/unit-type.enum';
import {IIngredient} from '../../shared/models/grocery/ingredient.interface';
import {UnitService} from '../../shared/services/unit-service/unit.service';
import {IngredientService} from '../../shared/services/ingredient-service/ingredient.service';
import {IIngredientType} from '../../shared/models/grocery/ingredient-type.interface';

export interface ICompleteIngredient {
  ingredientType: IIngredientType;
  unit: Unit;
  value: number;
}


export class IngredientHelper {

  static MergeLists(lists: ICompleteIngredient[][]): ICompleteIngredient[] {
    let added: ICompleteIngredient[] = [];
    for (let ingredientList of lists) {
      for (let ingredient of ingredientList) {
        added.push(ingredient);
      }
    }
    return this.MergeIngredients(added);

  }

  static MergeIngredients(ingredients: ICompleteIngredient[]): ICompleteIngredient[] {
    let merged: ICompleteIngredient[] = [];
    for (let ing of ingredients) {
      let addedSameType = merged.find(x => x.ingredientType.guid == ing.ingredientType.guid);
      if (addedSameType) {
        merged[merged.indexOf(addedSameType)] = IngredientHelper.Add(addedSameType, ing);
      } else {
        merged.push(ing);
      }
    }
    return merged;
  }

  static Add(ing1: ICompleteIngredient, ing2: ICompleteIngredient): ICompleteIngredient {
    let value1: number = ing1.value;
    let value2: number = ing2.value;
    let unit: Unit = ing1.unit;
    if (ing1.unit.id != ing2.unit.id) {
      if (ing1.unit.type != ing2.unit.type) {
        throw Error('Cannot add ingredients with different base');
      }
      switch (ing1.unit.type) {
        case EUnitType.mass:
          unit = {name: 'g', type: EUnitType.mass, id: 'g', shortname: 'g', tobase: 1};
          break;
        case EUnitType.count:
          unit = {name: 'db', type: EUnitType.count, id: 'db', shortname: 'db', tobase: 1};
          break;
        case EUnitType.volume:
          unit = {name: 'l', type: EUnitType.volume, id: 'l', shortname: 'l', tobase: 1};
          break;
      }
      value1 = ing1.value * ing1.unit.tobase;
      value2 = ing2.value * ing2.unit.tobase;
    }
    return {ingredientType: ing1.ingredientType, unit, value: +(value1 + value2).toFixed(7)};
  }

  /*
  static SubtractList(ingList1: ICompleteIngredient[], ingList2: ICompleteIngredient[]): ICompleteIngredient[] {
    let subtracted = ingList1;
    for (let ing of ingList2) {
      let containItem: ICompleteIngredient = subtracted.find(s => s.ingredientType.guid === ing.ingredientType.guid);
      if (containItem) {
        subtracted[subtracted.indexOf(containItem)] = this.Subtract(containItem, ing);
      }
    }
    return subtracted;
  }*/

  static Subtract(ing1: ICompleteIngredient, ing2: ICompleteIngredient) {
    //make same units
    //TODO Make mathod from this (duplication)
    let unit: Unit = ing1.unit;
    if (ing1.unit.id != ing2.unit.id) {
      if (ing1.unit.type != ing2.unit.type) {
        throw Error('Cannot add ingredients with different base');
      }
      switch (ing1.unit.type) {
        case EUnitType.mass:
          unit = {name: 'g', type: EUnitType.mass, id: 'g', shortname: 'g', tobase: 1};
          break;
        case EUnitType.count:
          unit = {name: 'db', type: EUnitType.count, id: 'db', shortname: 'db', tobase: 1};
          break;
        case EUnitType.volume:
          unit = {name: 'l', type: EUnitType.volume, id: 'l', shortname: 'l', tobase: 1};
          break;
      }
      ing1.value = ing1.value * ing1.unit.tobase;
      ing1.unit = unit;
      ing2.value = ing2.value * ing2.unit.tobase;
      ing2.unit = unit;
    }

    //do subtraction
    ing1.value = ing1.value - ing2.value;

    //calc remnant
    let remnant = 0;
    if (ing1.value < 0){
      remnant = Math.abs(ing1.value);
      ing1.value = 0;
    }

    //Roundings (float precision)
    ing1.value = +ing1.value.toFixed(7);
    ing2.value = +remnant.toFixed(7)
  }

  static ToCompleteIngredientList(ings: IIngredient[], unitService: UnitService, ingService: IngredientService): ICompleteIngredient[] {
    let ingredients: ICompleteIngredient[] = [];
    if (!ings) {
      return [];
    }
    for (let i of ings) {
      ingredients.push(this.ToCompleteIngredient(i, unitService, ingService));
    }
    return ingredients;
  }

  static ToCompleteIngredient(ing: IIngredient, unitService: UnitService, ingService: IngredientService): ICompleteIngredient {
    let type: IngredientType = ingService.GetIngredient(ing.ingredientID);
    let unit: Unit = unitService.GetUnit(ing.unit, type);

    if (!unit) {
      unit = type.options.cunits.find(u => u.id == ing.unit);
      unit.type = type.baseUnitType;
    }

    return {
      ingredientType: Object.assign({}, type),
      unit: Object.assign({}, unit),
      value: ing.value
    }
  }
}
