import {StoreService} from "atomik/lib/store-service/store-service";
import {ShoppingList} from "../../models/shopping-list.model";
import {Family} from "../../models/family.model";
import {IMealing} from "../../models/Days/IMealing.interface";
import {Day} from "../../models/Days/day.model";
import {ICompleteIngredient, IIngredient} from "../../interfaces/IIngredient";
import {Services} from "../../Services";
import {IngredientHelper} from "../../helpers/ingredient.helper";
import {IShoppingListService} from "./shopping-list.service.interface";
import {IShoppingList} from "../../models/shopping-list.interface";
import "../../extensions/string-extensions"
import "../../extensions/date-extensions"

export class ShoppingListService extends StoreService<ShoppingList> implements IShoppingListService {

    public async GetShoppingList(family: Family, nextShoppingDate: string): Promise<IShoppingList> {
        let dates: string[] = ShoppingListService.GetDatesFromNowTo(new Date().Today().ToYYYYMMDDString(), nextShoppingDate);

        let fixedMealings: IMealing[] = [];
        for (let date of dates) {
            let day = await Day.GetDay(date, family);
            day.mealings.forEach(m => {
                if (m.type == 'final') fixedMealings.push(m)
            });
        }

        let foodIngredients: ICompleteIngredient[] = IngredientHelper.ToCompleteIngredientList(
            ShoppingListService.GetFoodIngredientsFromMealings(fixedMealings)
        );

        let sections = Services.StorageService.GetSections(family);
        let ingredientListsAtHome = sections.map(s => IngredientHelper.ToCompleteIngredientList(s.Items));

        let ingredientsAtHome = IngredientHelper.MergeLists(ingredientListsAtHome);

        ingredientsAtHome = IngredientHelper.MergeIngredients(ingredientsAtHome);

        let essentials = IngredientHelper.ToCompleteIngredientList(Services.EssentialsService.GetEssentials(family).Essentials);

        let need = IngredientHelper.MergeLists([foodIngredients, essentials]);
        let buy: IIngredient[] = [];
        IngredientHelper.SubtractList(need, ingredientsAtHome).forEach(i => {
            if (i.value > 0)
                buy.push({ingredientID: i.ingredientType.guid, value: i.value, unit: i.unit.id});
        });

        return {IngredientsToBuy: buy, FamilyId: family.Id.toHexString(), IngredientsCompleted: []};
    }

    public static GetDatesFromNowTo(from: string, last: string): string[] {
        let dates: string[] = [];

        let fromDate: Date = from.YYYYMMDDToDate();
        let lastDate: Date = last.YYYYMMDDToDate();
        const limit = 80;
        let i = 0;
        let currentDate: Date = new Date(fromDate);
        while (currentDate.ToYYYYMMDDString() !== lastDate.ToYYYYMMDDString()) {
            if (i > limit) throw Error('Too many date string requested');
            dates.push(currentDate.ToYYYYMMDDString());
            currentDate.setDate(currentDate.getDate() + 1);
            i++;
        }
        dates.push(currentDate.ToYYYYMMDDString());


        return dates;

    }


    public static GetFoodIngredientsFromMealings(fixedMealings: IMealing[]): IIngredient[] {
        let foodIngredients: IIngredient[] = [];
        for (let mealing of fixedMealings) {
            let mealDose = mealing.dose ? mealing.dose : 4;
            let recipeDose = mealing.info.finalFood.dose;
            for (let ing of mealing.info.finalFood.ingredients) {
                foodIngredients.push({
                    ingredientID: ing.ingredientID,
                    value: Math.round(ing.value * mealDose / recipeDose * 1000) / 1000,
                    unit: ing.unit
                });
            }
        }
        return foodIngredients;
    }
}