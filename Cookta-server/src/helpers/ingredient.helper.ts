import {Services} from '../Services';
import {IngredientType} from '../models/ingredient-type/ingredient-type.model';
import {Unit} from '../models/unit/unit.model';
import {IUnit} from 'cookta-shared/src/models/unit/unit.interface';
import {EUnitType} from 'cookta-shared/src/models/unit/unit-type.enum';
import {ICompleteIngredient, IIngredient} from 'cookta-shared/src/models/ingredient/ingredient.interface';
import {IShoppingIngredient} from 'cookta-shared/src/models/shopping-list/shopping-list.interface';

export interface IIngredientRelatives {
    SectionItems: {sectionId: string, ingredient: IIngredient}[];
    MenuItems: {day: string, food: string, dose: number, ingredient: IIngredient}[];
    EssentialItems: {ingredient: IIngredient}[];
}

export interface ICompletedShoppingIngredient extends ICompleteIngredient {
    Relatives?: IIngredientRelatives;
}

export class IngredientHelper {

    static MergeLists(lists: ICompletedShoppingIngredient[][]): ICompletedShoppingIngredient[] {
        let added: ICompletedShoppingIngredient[] = [];
        for (let ingredientList of lists) {
            for (let ingredient of ingredientList) {
                added.push(ingredient);
            }
        }
        return this.MergeIngredients(added);

    }

    static MergeIngredients(ingredients: ICompletedShoppingIngredient[]): ICompletedShoppingIngredient[] {
        let merged: ICompletedShoppingIngredient[] = [];
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


    static AddNorm(ing1: IShoppingIngredient, ing2: IShoppingIngredient): IShoppingIngredient {
        let result = this.Add(IngredientHelper.ToCompleteIngredient(ing1), IngredientHelper.ToCompleteIngredient(ing2));
        return {ingredientID: result.ingredientType.guid, unit: result.unit.id, value: result.value} as any;
    }

    static Add(ing1: ICompletedShoppingIngredient, ing2: ICompletedShoppingIngredient): ICompletedShoppingIngredient {
        let value1: number = ing1.value;
        let value2: number = ing2.value;
        let unit: IUnit = ing1.unit;
        if (ing1.unit.id != ing2.unit.id) {
            unit = Unit.GetCommonBaseUnit(ing1, ing2);
            value1 = ing1.value * ing1.unit.tobase;
            value2 = ing2.value * ing2.unit.tobase;
        }
        let result: ICompletedShoppingIngredient =  {ingredientType: ing1.ingredientType, unit, value: +(value1 + value2).toFixed(7)};

        if (ing1.Relatives || ing2.Relatives)
            result.Relatives = this.MergeRelatives(ing1, ing2);

        return {ingredientType: ing1.ingredientType, unit, value: +(value1 + value2).toFixed(7)}
    }

    static SubtractList(ingList1: ICompletedShoppingIngredient[], ingList2: ICompletedShoppingIngredient[]): ICompletedShoppingIngredient[] {
        let subtracted = ingList1;
        for (let ing of ingList2) {
            let containItem: ICompleteIngredient = subtracted.find(s => s.ingredientType.guid === ing.ingredientType.guid && s.unit.type === ing.unit.type);
            if (containItem) {
                subtracted[subtracted.indexOf(containItem)] = this.Subtract(containItem, ing);
            }
        }
        return subtracted;
    }

    static Subtract(ing1: ICompletedShoppingIngredient, ing2: ICompletedShoppingIngredient): ICompletedShoppingIngredient {
        let ing2Negative = {...ing2};
        ing2Negative.value = -(Math.abs(ing2Negative.value));
        let result = this.Add(ing1, ing2Negative);
        result.value = +Math.max(result.value, 0).toFixed(7)
        return result;
    }

    static ToCompleteIngredientList(ings: IIngredient[]): ICompletedShoppingIngredient[] {
        let ingredients: ICompleteIngredient[] = [];
        if (!ings) return [];
        for (let i of ings){
            ingredients.push(this.ToCompleteIngredient(i));
        }
        return ingredients;
    }

    static ToCompleteIngredient(ing: IIngredient): ICompletedShoppingIngredient {
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
            value: ing.value,
            Relatives: ing['Relatives']
        }
    }
    private static MergeRelatives(ing1: ICompletedShoppingIngredient, ing2: ICompletedShoppingIngredient): IIngredientRelatives | undefined {
        if (!ing1.Relatives || !ing2.Relatives) return ing1.Relatives || ing2.Relatives;
        return {
            EssentialItems: [...ing1.Relatives.EssentialItems, ...ing2.Relatives.EssentialItems],
            MenuItems: [...ing1.Relatives.MenuItems, ...ing2.Relatives.MenuItems],
            SectionItems: [...ing1.Relatives.SectionItems, ...ing2.Relatives.SectionItems]
        }

    }

}
