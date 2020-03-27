import {ICompleteIngredient} from "../interfaces/IIngredient";
import {IIngredientType} from "../models/IngredientType/ingredient-type.interface";
import {EUnitType} from "../enums/unit-type.enum";
import {IUnit} from "../models/unit/unit.interface";
import {expect} from "chai";
import {ShoppingListService} from "../services/shopping-list/shopping-list.service";
import {IngredientHelper} from "./ingredient.helper";

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

let kg: IUnit = {name: 'kg', type: EUnitType.MASS, shortname: 'kg', tobase: 1000, id: 'kg'};
let dkg: IUnit = {name: 'dkg', type: EUnitType.MASS, shortname: 'dkg', tobase: 10, id: 'dkg'};
let g: IUnit = {name: 'g', type: EUnitType.MASS, tobase: 1, shortname: 'g', id: 'g'};
let dl: IUnit = {name: 'dl', type: EUnitType.VOLUME, tobase: 1000, shortname: 'dl', id: 'dl'};
let l: IUnit = {name: 'l', type: EUnitType.VOLUME, tobase: 1, shortname: 'l', id: 'l'};


describe('Shopping list service Tests', () => {
        /*it('Merge ingredient lists', () => {

            let ing1: ICompleteIngredient[] = [
                {ingredientType: bread, unit: kg, value: 2},
                {ingredientType: milk, unit: l, value: 1.2},
            ];
            let ing2: ICompleteIngredient[] = [
                {ingredientType: butter, unit: {name: 'knife', id: 'p', tobase: 20, type: EUnitType.MASS}, value: 2},
                {ingredientType: milk, unit: dl, value: 5},
                {ingredientType: bread, unit: g, value: 15},
                {ingredientType: milk, unit: l, value: 1},
            ];
            let ing3: ICompleteIngredient[] = [
                {ingredientType: butter, unit: dkg, value: 80},
                {ingredientType: milk, unit: milk.options.cunits[0], value: 3},
            ];
            const result = ShoppingListService.MergeLists([ing1, ing2]);
            expect(result).to.eql([
                {ingredientType: bread, unit: kg, value: 2},
                {ingredientType: milk, unit: dl, value: 5},
                {ingredientType: milk, unit: l, value: 1},
                {ingredientType: butter, unit: g, value: 2}]);
        });*/


        it('Merge list in its self', () => {

            let ingredients: ICompleteIngredient[] = [
                {ingredientType: butter, unit: {name: 'knife', id: 'p', shortname: 'knife', tobase: 20, type: EUnitType.MASS}, value: 2},
                {ingredientType: milk, unit: dl, value: 5},
                {ingredientType: bread, unit: g, value: 5},
                {ingredientType: butter, unit: g, value: 2},
                {ingredientType: bread, unit: g, value: 5},
                {ingredientType: milk, unit: l, value: 1},
            ];
            const result = IngredientHelper.MergeIngredients(ingredients);

            expect(result).to.eql([
                {ingredientType: butter, unit: g, value: 40},
                {ingredientType: milk, unit: l, value: 1.5},
                {ingredientType: bread, unit: g, value: 10}]);
        });


        it('Add same ingredients', () => {

            let ing1 = {ingredientType: butter, unit: dkg, value: 2};
            let ing2 = {ingredientType: butter, unit: dkg, value: 5};

            const result = IngredientHelper.Add(ing1, ing2);

            expect(result).to.eql({ingredientType: butter, unit: dkg, value: 7});
        });

        it('Add different unit ingredients', () => {

            let ing1: ICompleteIngredient = {
                ingredientType: butter,
                unit: {name: 'knife', id: 'p', shortname: 'knife', tobase: 20, type: EUnitType.MASS},
                value: 2
            };
            let ing2 = {ingredientType: butter, unit: dkg, value: 2};

            const result = IngredientHelper.Add(ing1, ing2);

            expect(result).to.eql({ingredientType: butter, unit: g, value: 60});
        });
    }
);
