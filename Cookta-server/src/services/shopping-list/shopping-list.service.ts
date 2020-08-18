import {Day} from '../../models/Days/day.model';
import {Services} from '../../Services';
import {IngredientHelper} from '../../helpers/ingredient.helper';
import {IShoppingListService} from './shopping-list.service.interface';
import '../../extensions/string-extensions';
import '../../extensions/date-extensions';
import {ICompleteIngredient, IIngredient} from 'cookta-shared/src/models/ingredient/ingredient.interface';
import {IShoppingIngredient, IShoppingList} from 'cookta-shared/src/models/shopping-list/shopping-list.interface';
import {IMealing} from 'cookta-shared/src/models/days/mealing.interface';
import {Collection, ObjectId} from 'mongodb';
import {ISaveShoppingList, ShoppingList} from '../../models/shopping-list.model';
import {IStorageSection} from 'cookta-shared/src/models/storage-sections/storage-section.interface';

export class ShoppingListService implements IShoppingListService {

    constructor(private collection: Collection) {
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

    private static GetFoodIngredientsFromMealings(fixedMealings: { m: IMealing, date: string }[]): IShoppingIngredient[] {
        let foodIngredients: IShoppingIngredient[] = [];
        for (let mealing of fixedMealings) {
            let mealDose = mealing.m.dose ? mealing.m.dose : 4;
            let recipeDose = mealing.m.info.finalFood.dose;
            for (let ing of mealing.m.info.finalFood.ingredients) {
                let scaledValue = Math.round(ing.value * mealDose / recipeDose * 1000) / 1000;
                foodIngredients.push({
                    ingredientID: ing.ingredientID,
                    value: scaledValue,
                    unit: ing.unit,
                    Relatives: {
                        MenuItems: [{
                            dose: mealDose,
                            food: mealing.m.foodId,
                            ingredient: {ingredientID: ing.ingredientID, unit: ing.unit, value: scaledValue},
                            day: mealing.date
                        }], EssentialItems: [], SectionItems: []
                    },
                });
            }
        }
        return foodIngredients;
    }

    async SetItemComplete(ingredientId: string, completed: boolean, familyId: string, familyStorages: IStorageSection[]): Promise<IShoppingList> {
        if (!familyStorages || familyStorages.length == 0) {
            throw new Error('Method need least one family storage');
        }
        let shoppingList = await this.GetServerShoppingList(familyId);
        if (completed) {
            let ing2Complete = (await shoppingList.GetIngredientsToBuy()).find(i => i.ingredientID == ingredientId);
            if (!ing2Complete) {
                return await shoppingList.ToSharedShoppingList();
            }
            let addTo = shoppingList.IngredientsCompleted.find(i => i.Ingredient.ingredientID == ingredientId);
            if (addTo) {
                addTo.Ingredient = IngredientHelper
                    .MergeIngredients(IngredientHelper
                        .ToCompleteIngredientList([addTo.Ingredient, ing2Complete]))
                    .map(i => {
                        return {ingredientID: i.ingredientType.guid, value: i.value, unit: i.unit.id};
                    })[0];
            } else {
                let shipStorage = familyStorages.find(i => i.Items.find(i => i.ingredientID == ing2Complete.ingredientID)) ?? familyStorages[0];
                shoppingList.IngredientsCompleted.push({
                    Ingredient: ing2Complete,
                    ShippingSectionId: shipStorage.Id.toHexString(),
                    Bought: undefined
                });
            }

        } else {
            shoppingList.IngredientsCompleted = shoppingList.IngredientsCompleted.filter(i => i.Ingredient.ingredientID != ingredientId);
        }
        await this.SaveShoppingList(shoppingList);
        return shoppingList.ToSharedShoppingList();
    }

    async SetItemCanceled(ingredientId: string, canceled: boolean, familyId: string): Promise<IShoppingList> {
        let shoppingList = await this.GetServerShoppingList(familyId);
        if (canceled) {
            let ing2Cancel = (await shoppingList.GetIngredientsToBuy()).find(i => i.ingredientID == ingredientId);
            if (!ing2Cancel) {
                return await shoppingList.ToSharedShoppingList();
            }
            shoppingList.IngredientsCanceled.push(ing2Cancel);
            shoppingList.IngredientsCanceled = IngredientHelper
                .MergeIngredients(IngredientHelper
                    .ToCompleteIngredientList(shoppingList.IngredientsCanceled))
                .map(ci => {
                    return {ingredientID: ci.ingredientType.guid, value: ci.value, unit: ci.unit.id};
                });


        } else {
            shoppingList.IngredientsCanceled = shoppingList.IngredientsCanceled.filter(i => i.ingredientID != ingredientId);
        }
        await this.SaveShoppingList(shoppingList);
        return shoppingList.ToSharedShoppingList();
    }

    async NewShoppingList(familyId: string, itemsToStorage: boolean = false): Promise<IShoppingList> {
        let oldList = await this.GetServerShoppingList(familyId);
        oldList.CompletedOn = Date.now();
        if (!itemsToStorage) oldList.IngredientsCompleted = [];
        else {
            let familySections = Services.StorageService.GetSections(familyId);
            if (familySections.length == 0) {
                let section = Services.StorageService.CreateSection(familyId);
                section.Name = 'Autocreated section';
                section.Items = oldList.IngredientsCompleted.map(i => i.Ingredient);
                await Services.StorageService.SaveItem(section);
            } else {
                for (let i of oldList.IngredientsCompleted) {
                    let sectionToPut = i.ShippingSectionId;
                    let addIngredient: IIngredient = {
                        ingredientID: i.Ingredient.ingredientID,
                        unit: i.Bought?.UnitId ?? i.Ingredient.unit,
                        value: i.Bought?.Value ?? i.Ingredient.value
                    };
                    try {
                        await Services.StorageService.AddItemToSection(sectionToPut, addIngredient);
                    } catch {
                        sectionToPut = familySections[0].Id.toHexString();
                        await Services.StorageService.AddItemToSection(sectionToPut, addIngredient);
                    }
                }
                ;
            }
        }
        await this.SaveShoppingList(oldList);

        let newList = await this.GetNewList(familyId);
        await this.SaveShoppingList(newList);
        return await newList.ToSharedShoppingList();
    }

    public async GetShoppingList(familyId: string, from?: string, to?: string): Promise<IShoppingList> {
        let shoppingList = await this.GetServerShoppingList(familyId, from, to);
        return await shoppingList.ToSharedShoppingList();
    }

    public async GetReqList(familyId: string, from: string, to: string): Promise<IShoppingIngredient[]> {
        let dates: string[] = ShoppingListService.GetDatesFromNowTo(from, to);

        let menuMealings: { m: IMealing, date: string }[] = [];
        for (let date of dates) {
            let day = await Day.GetDay(date, familyId);
            day.mealings.forEach(m => {
                if (m.type == 'final') {
                    menuMealings.push({m: m, date: day.date});
                }
            });
        }

        let foodIngredients: ICompleteIngredient[] = IngredientHelper.ToCompleteIngredientList(
            ShoppingListService.GetFoodIngredientsFromMealings(menuMealings)
        );
        foodIngredients = IngredientHelper.MergeIngredients(foodIngredients);

        let sections = Services.StorageService.GetSections(familyId);
        let sectionItems: IShoppingIngredient[] = [];
        sections.forEach(s => s.Items.forEach(i => sectionItems.push({
            ...i,
            Relatives: {
                MenuItems: [],
                SectionItems: [{sectionId: s.Id.toHexString(), ingredient: i}],
                EssentialItems: []
            }
        })))
        let ingredientListsAtHome = IngredientHelper.ToCompleteIngredientList(sectionItems);

        let ingredientsAtHome = IngredientHelper.MergeIngredients(ingredientListsAtHome);

        ingredientsAtHome = IngredientHelper.MergeIngredients(ingredientsAtHome);

        let essentials = IngredientHelper.ToCompleteIngredientList(Services.EssentialsService.GetEssentials(familyId).Essentials
            .map(e => {
                return {Relatives: {MenuItems: [], SectionItems: [], EssentialItems: [{ingredient: {...e}}]}, ...e}
            }));

        let need = IngredientHelper.SubtractList(foodIngredients, essentials);
        need = need.filter(i => i.value > 0);
        need = IngredientHelper.MergeLists([need, essentials]);

        let buy: IShoppingIngredient[] = [];
        IngredientHelper.SubtractList(need, ingredientsAtHome).forEach(i => {
            if (i.value > 0) {
                buy.push({ingredientID: i.ingredientType.guid, value: i.value, unit: i.unit.id, Relatives: i.Relatives});
            }
        });
        return buy;
    }

    async SetCompleteQuantityAndTarget(familyId: string, ingredient: IIngredient, targetSection: string): Promise<void> {
        let docs: ISaveShoppingList = await this.collection.findOne({
            FamilyId: new ObjectId(familyId),
            CompletedOn: undefined
        });
        let itemIndex = docs.IngredientsCompleted.findIndex(i => i.Ingredient.ingredientID == ingredient
            .ingredientID);
        let item = docs.IngredientsCompleted[itemIndex];
        if (!item) return;
        item.Bought = !ingredient.unit || !ingredient.value ? undefined : {
            UnitId: ingredient.unit,
            Value: ingredient.value
        };
        if (targetSection) item.ShippingSectionId = targetSection;
        docs.IngredientsCompleted[itemIndex] = item;
        await this.collection.replaceOne({_id: docs._id}, docs);
    }

    private async GetServerShoppingList(familyId: string, from?: string, to?: string): Promise<ShoppingList> {
        let docs = await this.collection.findOne({FamilyId: new ObjectId(familyId), CompletedOn: undefined});

        let shoppingList: ShoppingList;
        if (!docs) {
            shoppingList = await this.GetNewList(familyId);
        } else {
            shoppingList = await ShoppingList.FromSaveShoppingList(docs);
        }
        if (from && to) await shoppingList.SetFromTo(from.YYYYMMDDToDate(), to.YYYYMMDDToDate());
        await this.SaveShoppingList(shoppingList);

        return shoppingList;
    }

    private async SaveShoppingList(list: ShoppingList) {
        await this.collection.replaceOne({_id: list.id}, list.ToSaveShoppingList(), {upsert: true});
    }

    private async GetNewList(familyId: string): Promise<ShoppingList> {
        let from = new Date(Date.now());
        let to = new Date(Date.now());
        to.setDate(to.getDate() + 7);
        let shoppingList = new ShoppingList(new ObjectId(), await this.GetReqList(familyId, from.ToYYYYMMDDString(), to.ToYYYYMMDDString())
            , [], [], familyId, to.getTime(), Date.now(), undefined, from.getTime());
        return shoppingList;
    }

}
