import {ICompleteIngredient} from "../interfaces/IIngredient";
import {IUnit} from "../models/unit/unit.interface";
import {EUnitType} from "../enums/unit-type.enum";

export class IngredientHelper {

    static MergeLists(lists: ICompleteIngredient[][]): ICompleteIngredient[] {
        let added: ICompleteIngredient[] = [];
        for (let ingredientList of lists){
            for (let ingredient of ingredientList){
                added.push(ingredient);
            }
        }
        return this.MergeIngredients(added);

    }

    static MergeIngredients(ingredients: ICompleteIngredient[]): ICompleteIngredient[] {
        let merged: ICompleteIngredient[] = [];
        for (let ing of ingredients){
            let addedSameType = merged.find(x => x.ingredientType.guid == ing.ingredientType.guid);
            if (addedSameType){
                merged[merged.indexOf(addedSameType)] = IngredientHelper.Add(addedSameType, ing);
            }else{
                merged.push(ing);
            }
        }
        return merged;
    }

    static Add(Ing1: ICompleteIngredient, Ing2: ICompleteIngredient): ICompleteIngredient{
        let value1: number = Ing1.value;
        let value2: number = Ing2.value;
        let unit: IUnit = Ing1.unit;
        if (Ing1.unit.id != Ing2.unit.id)
        {
            if (Ing1.unit.type != Ing2.unit.type) throw Error("Cannot add ingredients with different base");
            switch (Ing1.unit.type){
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
            value1 = Ing1.value * Ing1.unit.tobase;
            value2 = Ing2.value * Ing2.unit.tobase;
        }
        return {ingredientType: Ing1.ingredientType, unit, value: +(value1 + value2).toFixed(7)}
    }
}
