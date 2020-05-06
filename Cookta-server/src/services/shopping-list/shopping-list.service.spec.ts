
import {expect} from "chai";
import {ShoppingListService} from "./shopping-list.service";
import {ISendableFood} from "cookta-shared/src/models/food/food-sendable.interface";
import { IMealing } from 'cookta-shared/src/models/days/mealing.interface';

const placeholderFood: ISendableFood = {
    owner: 'owner',
    name: 'name',
    desc: 'desc',
    published: true,
    ingredients: [],
    imageUploaded: 0,
    uploaded: 0,
    dose: 4,
    tags: [],
    autoTags: [],
    lastModified: 0,
    subscriptions: 0,
    id: 'string',
    foodId: 'string',
    SubscribedFor: false,
    OwnFood: true
}

describe('Shopping list service', () => {
    describe('final mealings to ingredient list', () => {
        it('Simple add ingredients', () => {
            let mealings: IMealing[] = [{
                type: 'final', mealIndex: 2, info: {
                    finalFood: {
                        ...placeholderFood, ...{
                            ingredients: [
                                {ingredientID: 'ing1', unit: 'unit1', value: 2},
                                {ingredientID: 'ing2', unit: 'unit2', value: 5}]
                        },
                    }
                }
            },
                {
                    type: 'final', mealIndex: 4, dose: 4, info: {
                        finalFood: {
                            ...placeholderFood, ...{
                                ingredients: [
                                    {ingredientID: 'ing3', unit: 'unit3', value: 1},
                                    {ingredientID: 'ing5', unit: 'unit5', value: 1}]
                            },
                        }
                    }
                }
            ];
            const result = ShoppingListService.GetFoodIngredientsFromMealings(mealings);
            expect(result).to.eql([
                {ingredientID: 'ing1', unit: 'unit1', value: 2},
                {ingredientID: 'ing2', unit: 'unit2', value: 5},

                {ingredientID: 'ing3', unit: 'unit3', value: 1},
                {ingredientID: 'ing5', unit: 'unit5', value: 1}
            ]);
        });
        it('Scale ingredients from recipe food to mealing', () => {

            let mealings: IMealing[] = [{
                type: 'final', mealIndex: 2, dose: 6, info: {
                    finalFood: {
                        ...placeholderFood, ...{
                            ingredients: [
                                {ingredientID: 'ing1', unit: 'unit1', value: 2},
                                {ingredientID: 'ing2', unit: 'unit2', value: 5}],
                            dose: 3,
                        },
                    }
                }
            },
                {
                    type: 'final', mealIndex: 4, dose: 4, info: {
                        finalFood: {
                            ...placeholderFood, ...{
                                ingredients: [
                                    {ingredientID: 'ing3', unit: 'unit3', value: 1},
                                    {ingredientID: 'ing5', unit: 'unit5', value: 1}],
                                dose: 3
                            },
                        }
                    }
                }
            ];
            const result = ShoppingListService.GetFoodIngredientsFromMealings(mealings);
            expect(result).to.eql([
                {ingredientID: 'ing1', unit: 'unit1', value: 4},
                {ingredientID: 'ing2', unit: 'unit2', value: 10},

                {ingredientID: 'ing3', unit: 'unit3', value: 1.333},
                {ingredientID: 'ing5', unit: 'unit5', value: 1.333}
            ]);
        });
    });
    it('Get dates from now to x', () => {
        const dateStrings: string[] = ShoppingListService.GetDatesFromNowTo('2020-03-30', '2020-04-02');

        expect(dateStrings).to.eql(['2020-03-30', '2020-03-31', '2020-04-01', '2020-04-02']);
    });
});
