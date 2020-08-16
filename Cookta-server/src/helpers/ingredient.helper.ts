import {Services} from '../Services';
import {IngredientType} from '../models/ingredient-type/ingredient-type.model';
import {Unit} from '../models/unit/unit.model';
import {IUnit} from 'cookta-shared/src/models/unit/unit.interface';
import {EUnitType} from 'cookta-shared/src/models/unit/unit-type.enum';
import {ICompleteIngredient, IIngredient} from 'cookta-shared/src/models/ingredient/ingredient.interface';
import {IShoppingIngredient} from 'cookta-shared/src/models/shopping-list/shopping-list.interface';


export interface ICompletedShoppingIngredient extends ICompleteIngredient {
    Relatives: {
        SectionItems: {sectionId: string, ingredient: IIngredient}[];
        MenuItems: {day: string, food: string, dose: number, ingredient: IIngredient}[];
        EssentialItems: {ingredient: IIngredient}[];
    };
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
                try {
                    merged[merged.indexOf(addedSameType)] = IngredientHelper.Add(addedSameType, ing);
                }
                catch {
                    console.log('No common base unit for ingredients.');
                    console.log('Ingredient 1');
                    console.log(addedSameType);
                    console.log('Ingredient 2');
                    console.log(ing);
                    merged.push(ing);
                }
            } else {
                merged.push(ing);
            }
        }
        return merged;
    }


    static AddNorm(ing1: IIngredient, ing2: IIngredient): IIngredient {
        let result = this.Add(IngredientHelper.ToCompleteIngredient(ing1), IngredientHelper.ToCompleteIngredient(ing2));
        return {ingredientID: result.ingredientType.guid, unit: result.unit.id, value: result.value};
    }

    static Add(ing1: ICompleteIngredient, ing2: ICompleteIngredient): ICompleteIngredient {
        let value1: number = ing1.value;
        let value2: number = ing2.value;
        let unit: IUnit = ing1.unit;
        if (ing1.unit.id != ing2.unit.id) {
            unit = Unit.GetCommonBaseUnit(ing1, ing2);
            value1 = ing1.value * ing1.unit.tobase;
            value2 = ing2.value * ing2.unit.tobase;
        }

        if (){

        }

        return {ingredientType: ing1.ingredientType, unit, value: +(value1 + value2).toFixed(7)}
    }

    static SubtractList(ingList1: ICompleteIngredient[], ingList2: ICompleteIngredient[]): ICompleteIngredient[] {
        let subtracted = ingList1;
        for (let ing of ingList2) {
            let containItem: ICompleteIngredient = subtracted.find(s => s.ingredientType.guid === ing.ingredientType.guid && s.unit.type === ing.unit.type);
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
            if (ing1.unit.type != ing2.unit.type)
                throw Error("Cannot add ingredients with different base");
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
        let unit: IUnit = (Services.UnitService.GetAllItems() as IUnit[]).find(u => u.id == ing.unit);

        if (!unit){
            unit = type.options.cunits.find(u => u.id == ing.unit);
            if (type.massEnabled) unit.type = EUnitType.MASS;
            if (type.volumeEnabled) unit.type = EUnitType.VOLUME;
            if (type.countEnabled) unit.type = EUnitType.COUNT;
        }

        return {
            ingredientType: Object.assign({}, type),
            unit: Object.assign({}, unit),
            value: ing.value}
    }
l
    private static MergeRelatives(ing1: ICompleteIngredient, ing2: ICompleteIngredient): IShoppingIngredient {
        let result: IShoppingIngredient;
        if (!(ing1 as ICompletedShoppingIngredient).Relatives || (ing2 as ICompletedShoppingIngredient).Relatives){
            result.Relatives = ing1['Relatives' || ing2['Relatives'];
            return result;
        }

    }

}
