import {ICompleteIngredient, IIngredient} from "../interfaces/IIngredient";
import {IUnit} from "../models/unit/unit.interface";
import {EUnitType} from "../enums/unit-type.enum";
import {IIngredientType} from "../models/ingredient-type/ingredient-type.interface";
import {Services} from "../Services";
import {Unit} from "../models/unit/unit.model";
import {IngredientType} from "../models/ingredient-type/ingredient-type.model";

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
        let unit: IUnit = ing1.unit;
        if (ing1.unit.id != ing2.unit.id) {
            if (ing1.unit.type != ing2.unit.type) throw Error("Cannot add ingredients with different base");
            switch (ing1.unit.type) {
                case EUnitType.MASS:
                    unit = {name: 'g', type: EUnitType.MASS, id: 'g', shortname: 'g', tobase: 1};
                    break;
                case EUnitType.COUNT:
                    unit = {name: 'db', type: EUnitType.COUNT, id: 'db', shortname: 'db', tobase: 1};
                    break;
                case EUnitType.VOLUME:
                    unit = {name: 'l', type: EUnitType.VOLUME, id: 'l', shortname: 'l', tobase: 1};
                    break;
            }
            value1 = ing1.value * ing1.unit.tobase;
            value2 = ing2.value * ing2.unit.tobase;
        }
        return {ingredientType: ing1.ingredientType, unit, value: +(value1 + value2).toFixed(7)}
    }

    static SubtractList(ingList1: ICompleteIngredient[], ingList2: ICompleteIngredient[]): ICompleteIngredient[] {
        let subtracted = ingList1;
        for (let ing of ingList2) {
            let containItem: ICompleteIngredient = subtracted.find(s => s.ingredientType.guid === ing.ingredientType.guid);
            if (containItem) {
                subtracted[subtracted.indexOf(containItem)] = this.Subtract(containItem, ing);
            }
        }
        return subtracted;
    }

    static Subtract(ing1: ICompleteIngredient, ing2: ICompleteIngredient): ICompleteIngredient {
        let value1: number = ing1.value;
        let value2: number = ing2.value;
        let unit: IUnit = ing1.unit;
        if (ing1.unit.id != ing2.unit.id) {
            if (ing1.unit.type != ing2.unit.type) throw Error("Cannot add ingredients with different base");
            switch (ing1.unit.type) {
                case EUnitType.MASS:
                    unit = {name: 'g', type: EUnitType.MASS, id: 'g', shortname: 'g', tobase: 1};
                    break;
                case EUnitType.COUNT:
                    unit = {name: 'db', type: EUnitType.COUNT, id: 'db', shortname: 'db', tobase: 1};
                    break;
                case EUnitType.VOLUME:
                    unit = {name: 'l', type: EUnitType.VOLUME, id: 'l', shortname: 'l', tobase: 1};
                    break;
            }
            value1 = ing1.value * ing1.unit.tobase;
            value2 = ing2.value * ing2.unit.tobase;
        }
        return {ingredientType: ing1.ingredientType, unit, value: Math.max(+(value1 - value2).toFixed(7), 0)}
    }

    static ToCompleteIngredientList(ings: IIngredient[]): ICompleteIngredient[] {
        let ingredients: ICompleteIngredient[] = [];
        if (!ings) return [];
        for (let i of ings){
            ingredients.push(this.ToCompleteIngredient(i));
        }
        return ingredients;
    }

    static ToCompleteIngredient(ing: IIngredient): ICompleteIngredient {
        let type: IngredientType = Services.IngredientTypeService.FindOne(t => t.guid == ing.ingredientID);
        let unit: IUnit = ((Services.UnitService.GetAllItems() as IUnit[]).concat(type.options.cunits)).find(u => u.id == ing.unit);

        return {
            ingredientType: Object.assign({}, type),
            unit: Object.assign({}, unit),
            value: ing.value}
    }
}
