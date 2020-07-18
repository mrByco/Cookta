import {Day} from '../../models/Days/day.model';
import {Services} from '../../Services';
import {IngredientHelper} from '../../helpers/ingredient.helper';
import {IShoppingListService} from './shopping-list.service.interface';
import '../../extensions/string-extensions';
import '../../extensions/date-extensions';
import {ICompleteIngredient, IIngredient} from 'cookta-shared/src/models/ingredient/ingredient.interface';
import {IShoppingList} from 'cookta-shared/src/models/shopping-list/shopping-list.interface';
import {IMealing} from 'cookta-shared/src/models/days/mealing.interface';
import {Collection, ObjectId} from 'mongodb';
import {ShoppingList} from "../../models/shopping-list.model";

export class ShoppingListService implements IShoppingListService {

    constructor(private collection: Collection) {
    }

    SetItemComplete(ingredientId: string, completed: boolean, familyId: string) {

    }
    SetItemCanceled(ingredientId: string, canceled: boolean, familyId: string) {
        throw new Error("Method not implemented.");
    }
    async NewShoppingList(familyId: string): Promise<IShoppingList> {
        let oldList = await this.GetServerShoppingList(familyId);
        oldList.CompletedOn = Date.now();
        await this.SaveShoppingList(oldList);

        let newList = await this.GetNewList(familyId);
        await this.SaveShoppingList(newList);
        return await newList.ToShoppingList();
    }
    FinishItems(familyId: string) {
        throw new Error("Method not implemented.");
    }

    private static GetDatesFromNowTo(from: string, last: string): string[] {
        let dates: string[] = [];

        let fromDate: Date = from.YYYYMMDDToDate();
        let lastDate: Date = last.YYYYMMDDToDate();
        const limit = 80;
        let i = 0;
        let currentDate: Date = new Date(fromDate);
        while (currentDate.ToYYYYMMDDString() !== lastDate.ToYYYYMMDDString()) {
            if (i > limit) {
                throw Error('Too many date string requested');
            }
            dates.push(currentDate.ToYYYYMMDDString());
            currentDate.setDate(currentDate.getDate() + 1);
            i++;
        }
        dates.push(currentDate.ToYYYYMMDDString());


        return dates;

    }

    private static GetFoodIngredientsFromMealings(fixedMealings: IMealing[]): IIngredient[] {
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

    public async GetShoppingList(familyId: string): Promise<IShoppingList> {
        return this.GetServerShoppingList(familyId).then(s => s.ToShoppingList());
    }

    private async GetServerShoppingList(familyId: string): Promise<ShoppingList> {
        let docs = await this.collection.findOne({FamilyId: new ObjectId(familyId), CompletedOn: undefined});

        let shoppingList: ShoppingList;
        if (!docs){
            shoppingList = await this.GetNewList(familyId);
        }else {
            shoppingList = await ShoppingList.FromSaveShoppingList(docs);
        }
        await this.SaveShoppingList(shoppingList);

        return shoppingList;
    }

    public async GetReqList(familyId: string, from: string, to: string): Promise<IIngredient[]> {
        let dates: string[] = ShoppingListService.GetDatesFromNowTo(from, to);

        let fixedMealings: IMealing[] = [];
        for (let date of dates) {
            let day = await Day.GetDay(date, familyId);
            day.mealings.forEach(m => {
                if (m.type == 'final') {
                    fixedMealings.push(m);
                }
            });
        }

        let foodIngredients: ICompleteIngredient[] = IngredientHelper.ToCompleteIngredientList(
            ShoppingListService.GetFoodIngredientsFromMealings(fixedMealings)
        );
        foodIngredients = IngredientHelper.MergeIngredients(foodIngredients);

        let sections = Services.StorageService.GetSections(familyId);
        let ingredientListsAtHome = sections.map(s => IngredientHelper.ToCompleteIngredientList(s.Items));

        let ingredientsAtHome = IngredientHelper.MergeLists(ingredientListsAtHome);

        ingredientsAtHome = IngredientHelper.MergeIngredients(ingredientsAtHome);

        let essentials = IngredientHelper.ToCompleteIngredientList(Services.EssentialsService.GetEssentials(familyId).Essentials);

        let need = IngredientHelper.SubtractList(foodIngredients, essentials);
        need = need.filter(i => i.value > 0);
        need = IngredientHelper.MergeLists([need, essentials]);

        let buy: IIngredient[] = [];
        IngredientHelper.SubtractList(need, ingredientsAtHome).forEach(i => {
            if (i.value > 0) {
                buy.push({ingredientID: i.ingredientType.guid, value: i.value, unit: i.unit.id});
            }
        });
        return buy;
    }

    private async SaveShoppingList(list: ShoppingList){
        await this.collection.replaceOne({_id: list.id}, list.ToSaveShoppingList(), {upsert: true});
    }

    private async GetNewList(familyId: string): Promise<ShoppingList>{
        let from = new Date(Date.now());
        let to = new Date(Date.now());
        to.setDate(to.getDate() + 7);
        let shoppingList = new ShoppingList(new ObjectId(), await this.GetReqList(familyId, from.ToYYYYMMDDString(), to.ToYYYYMMDDString())
            , [], [], familyId, to.getTime(), Date.now(), undefined, from.getTime());
        return shoppingList;
    }

}
