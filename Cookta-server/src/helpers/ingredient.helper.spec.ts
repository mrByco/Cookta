

import {expect} from "chai";
import {IngredientHelper} from "./ingredient.helper";
import {EUnitType} from "cookta-shared/dist/models/unit/unit-type.enum";
import {IUnit} from "cookta-shared/dist/models/unit/unit.interface";
import {IIngredientType} from "cookta-shared/dist/models/ingredient-type/ingredient-type.interface";
import {ICompleteIngredient} from "cookta-shared/dist/models/ingredient/ingredient.interface";

// DEFINE WORKING INFO
let bread: IIngredientType = {
    name: 'bread', category: 'base', countEnabled: false, massEnabled: true, volumeEnabled: false,
    guid: 'asd1', options: {cunits: [{name: 'piece', id: 'p', shortname: "piece", tobase: 500, type: EUnitType.MASS}]}
};
let milk: IIngredientType = {
    name: 'milk', category: 'base', countEnabled: false, massEnabled: false, volumeEnabled: true,
    guid: 'asd2', options: {cunits: [{name: 'cup', id: 'c', shortname: "cup", tobase: 0.2, type: EUnitType.VOLUME}]}
};
let spice: IIngredientType = {
    name: 'spice', category: 'base', countEnabled: false, massEnabled: true, volumeEnabled: false,
    guid: 'asd3', options: {cunits: []}
};
let butter: IIngredientType = {
    name: 'butter', category: 'base', countEnabled: false, massEnabled: true, volumeEnabled: false,
    guid: 'asd4', options: {cunits: [{name: 'knife', id: 'p', shortname: "knife", tobase: 20, type: EUnitType.MASS}]}
};
let chocolate: IIngredientType = {
    name: 'chocolate', category: 'base', countEnabled: true, massEnabled: false, volumeEnabled: false,
    guid: 'asd5', options: {cunits: []}
};

let kg: IUnit = {name: 'kg', type: EUnitType.MASS, shortname: 'kg', tobase: 1000, id: 'kg'};
let dkg: IUnit = {name: 'dkg', type: EUnitType.MASS, shortname: 'dkg', tobase: 10, id: 'dkg'};
let g: IUnit = {name: 'g', type: EUnitType.MASS, tobase: 1, shortname: 'g', id: 'g'};
let dl: IUnit = {name: 'dl', type: EUnitType.VOLUME, tobase: 0.1, shortname: 'dl', id: 'dl'};
let l: IUnit = {name: 'l', type: EUnitType.VOLUME, tobase: 1, shortname: 'l', id: 'l'};

describe('Ingredient utility', () => {
    describe('adding, merging tests', () => {
            it('Merge ingredient lists', () => {

                let ing1: ICompleteIngredient[] = [
                    {ingredientType: bread, unit: kg, value: 2},
                    {ingredientType: milk, unit: l, value: 1.2},
                ];
                let ing2: ICompleteIngredient[] = [
                    {
                        ingredientType: butter,
                        unit: {name: 'knife', id: 'p', tobase: 20, shortname: 'knife', type: EUnitType.MASS},
                        value: 2
                    },
                    {ingredientType: milk, unit: dl, value: 5},
                    {ingredientType: bread, unit: g, value: 15},
                    {ingredientType: milk, unit: l, value: 1},
                ];
                let ing3: ICompleteIngredient[] = [
                    {ingredientType: butter, unit: dkg, value: 80},
                    {ingredientType: milk, unit: milk.options.cunits[0], value: 3},
                ];
                const result = IngredientHelper.MergeLists([ing1, ing2, ing3]);
                expect(result).to.eql([
                    {ingredientType: bread, unit: g, value: 2015},
                    {ingredientType: milk, unit: l, value: 3.3},
                    {ingredientType: butter, unit: g, value: 840}]);
            });
            it('Merge list in its self', () => {

                let ingredients: ICompleteIngredient[] = [
                    {
                        ingredientType: butter,
                        unit: {name: 'knife', id: 'p', shortname: 'knife', tobase: 20, type: EUnitType.MASS},
                        value: 2
                    },
                    {ingredientType: milk, unit: dl, value: 5},
                    {ingredientType: bread, unit: g, value: 5},
                    {ingredientType: butter, unit: g, value: 2},
                    {ingredientType: bread, unit: g, value: 5},
                    {ingredientType: milk, unit: l, value: 1},
                ];
                const result = IngredientHelper.MergeIngredients(ingredients);

                expect(result).to.eql([
                    {ingredientType: butter, unit: g, value: 42},
                    {ingredientType: milk, unit: l, value: 1.5},
                    {ingredientType: bread, unit: g, value: 10}]);
            });
            it('Add same ingredients', () => {

                let ing1 = {ingredientType: butter, unit: dkg, value: 2};
                let ing2 = {ingredientType: butter, unit: dkg, value: 5};

                const result = IngredientHelper.Add(ing1, ing2);

                expect(result).to.eql({ingredientType: butter, unit: dkg, value: 7});
            });
            it('Add different unit ingredients (1)', () => {

                let ing1: ICompleteIngredient = {
                    ingredientType: butter,
                    unit: {name: 'knife', id: 'p', shortname: 'knife', tobase: 20, type: EUnitType.MASS},
                    value: 2
                };
                let ing2 = {ingredientType: butter, unit: dkg, value: 2};

                const result = IngredientHelper.Add(ing1, ing2);

                expect(result).to.eql({ingredientType: butter, unit: g, value: 60});
            });
            it('Add different unit ingredients (2)', () => {

                let ing1: ICompleteIngredient = {
                    ingredientType: spice,
                    unit: {name: 'big piece', id: 'bp', shortname: 'knife', tobase: 20, type: EUnitType.COUNT},
                    value: 2
                };
                let ing2 = {
                    ingredientType: spice,
                    unit: {name: 'small piece', id: 'sp', shortname: 'knife', tobase: 1, type: EUnitType.COUNT},
                    value: 3
                };

                const result = IngredientHelper.Add(ing1, ing2);

                expect(result).to.eql({
                    ingredientType: spice,
                    unit: {name: 'db', type: EUnitType.COUNT, id: 'db', shortname: 'db', tobase: 1},
                    value: 43
                });
            });
        }
    );
    describe('subtract tests', () => {
            it('Subtract two ingredients same type', () => {
                let ing1: ICompleteIngredient = { ingredientType: bread, unit: kg, value: 1.3 };
                let ing2: ICompleteIngredient = { ingredientType: bread, unit: kg, value: .5 };
                const result: ICompleteIngredient = IngredientHelper.Subtract(ing1, ing2);
                expect(result).to.eql({ ingredientType: bread, unit: kg, value: .8 });
            });
            it('Subtract two ingredients different type', () => {
                let ing1: ICompleteIngredient = { ingredientType: bread, unit: kg, value: 1 };
                let ing2: ICompleteIngredient = { ingredientType: bread, unit: dkg, value:  40};
                const result: ICompleteIngredient = IngredientHelper.Subtract(ing1, ing2);
                expect(result).to.eql({ ingredientType: bread, unit: g, value: 600 });
            });
            it('Subtract two ingredients min 0', () => {
                let ing1: ICompleteIngredient = { ingredientType: bread, unit: kg, value: 1.3 };
                let ing2: ICompleteIngredient = { ingredientType: bread, unit: kg, value: 2 };
                const result: ICompleteIngredient = IngredientHelper.Subtract(ing1, ing2);
                expect(result).to.eql({ ingredientType: bread, unit: kg, value: 0 });
            });
            it('Subtract non repeating lists', () => {
                let list1: ICompleteIngredient[] = [
                    {ingredientType: bread, unit: kg, value: 2},
                    {ingredientType: chocolate, unit: dl, value: 1},
                    {ingredientType: milk, unit: l, value: 3}
                ];
                let list2: ICompleteIngredient[] = [
                    {ingredientType: chocolate, unit: l, value: 7},
                    {ingredientType: bread, unit: dkg, value: 40},
                    {ingredientType: spice, unit: g, value: 20},
                    {ingredientType: milk, unit: dl, value: 20}
                ];
                const result: ICompleteIngredient[] = IngredientHelper.SubtractList(list1, list2);
                expect(result).to.eql([
                    {ingredientType: bread, unit: g, value: 1600},
                    {ingredientType: chocolate, unit: l, value: 0},
                    {ingredientType: milk, unit: l, value: 1}
                ]);
            });
        }
    );
});
