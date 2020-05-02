import {StoreService} from 'atomik/lib/store-service/store-service';
import {IUnitService} from './unit.service.interface';
import {Unit} from '../../models/unit/unit.model';
import {IUnit} from "cookta-shared/src/models/unit/unit.interface";
import {EUnitType} from "cookta-shared/src/models/unit/unit-type.enum";
import {Food} from "../../models/food/food.model";
import {Services} from "../../Services";
import {IEssentialSection} from "../../models/essentials/essential-list.interface";
import {EssentialSection} from "../../models/essentials/essential-list.model";
import {StorageSection} from "../../models/storage-section.model";
import {IBadUnit} from "cookta-shared/src/models/unit/bad-unit.interface";
import {IIngredient} from "cookta-shared/src/models/ingredient/ingredient.interface";
import {IIngredientType} from "cookta-shared/src/models/ingredient-type/ingredient-type.interface";
import { IStorageSection } from 'cookta-shared/src/models/storage-sections/storage-section.interface';


export class UnitService extends StoreService<Unit> implements IUnitService {
    GetAvailableUnitsForType(type: IIngredientType): IUnit[] {
        return this.Items.filter(u => {
            switch (u.type) {
                case EUnitType.VOLUME:
                    return type.volumeEnabled;
                case EUnitType.COUNT:
                    return type.countEnabled;
                case EUnitType.MASS:
                    return type.massEnabled;
            }
        }).map(u => u as IUnit).concat(...(type.options?.cunits ? type.options.cunits : []));
    }

    async GetBadUnitReferences(essentials: IEssentialSection[], storages: IStorageSection[], foods: Food[]): Promise<IBadUnit[]> {

        let references = await this.GetBadUnitObjects(essentials, storages, foods);

        let badUnits: IBadUnit[] = [];

        for (let food of references.foods) {
            for (let ing of food.ingredients) {
                if (this.IsIngredientInInvalidUnit(ing))
                    this.IncrementUnitInBadUnits(badUnits, ing);
            }
        }
        for (let essentialSection of references.essentials) {
            for (let ing of essentialSection.Essentials) {
                if (this.IsIngredientInInvalidUnit(ing))
                    this.IncrementUnitInBadUnits(badUnits, ing);
            }
        }
        for (let storageSection of references.storageSections) {
            for (let ing of storageSection.Items) {
                if (this.IsIngredientInInvalidUnit(ing))
                    this.IncrementUnitInBadUnits(badUnits, ing);
            }
        }
        return badUnits;
    }

    async FixBadUnit(unitId: string, ingredientId: string, fixUnit: IUnit, fixMultiplier: number, essentialSections: IEssentialSection[], storageSections: IStorageSection[], foods: Food[]) {
        for (let section of essentialSections) {
            this.FixItemsInIngArray(section.Essentials, ingredientId, unitId, fixUnit, fixMultiplier);
            await Services.EssentialsService.SaveItem(section as EssentialSection);
        }
        for (let section of storageSections) {
            this.FixItemsInIngArray(section.Items, ingredientId, unitId, fixUnit, fixMultiplier);
            await Services.StorageService.SaveItem(section as StorageSection);
        }
        for (let food of foods) {
            this.FixItemsInIngArray(food.ingredients, ingredientId, unitId, fixUnit, fixMultiplier);
            await food.Save();
        }
        return true;
    }

    //!It works on the original array!
    private FixItemsInIngArray(ings: IIngredient[], ingredientId: string, invalidUnitId: string, replaceTo: IUnit, fixmultiplier: number) {
        if (!ings) return;
        let i = 0;
        for (let ing of ings) {
            if (ing.ingredientID == ingredientId && ing.unit == invalidUnitId)
                ings[i] = {ingredientID: ingredientId, unit: replaceTo.id, value: ing.value * fixmultiplier};
            i++;
        }
    }


    private async GetBadUnitObjects(essentials: IEssentialSection[], storages: IStorageSection[], foods: Food[]): Promise<{ foods: Food[], storageSections: IStorageSection[], essentials: IEssentialSection[] }> {

        let foodRefs = foods.filter(f => f.ingredients.find(i => this.IsIngredientInInvalidUnit(i)));

        let essentialRefs = essentials.filter(e => e.Essentials.find(i => this.IsIngredientInInvalidUnit(i)));

        let storageRefs = storages.filter(s => s.Items?.find(i => this.IsIngredientInInvalidUnit(i)));

        return {essentials: essentialRefs, foods: foodRefs, storageSections: storageRefs}
    }

    private IncrementUnitInBadUnits(badUnits: IBadUnit[], ingredient: IIngredient) {
        if (badUnits.find(bu => bu.UnitId == ingredient.unit && bu.IngredientId == ingredient.ingredientID)) {
            badUnits.find(bu => bu.UnitId == ingredient.unit && bu.IngredientId == ingredient.ingredientID).Count++;
        } else {
            let unit = this.FindOne(u => u.id == ingredient.unit);
            if (!unit) return;
            badUnits.push({Count: 1, IngredientId: ingredient.ingredientID, UnitId: unit.id});
        }
    }

    private IsIngredientInInvalidUnit(ingredient: IIngredient) {
        let type = Services.IngredientTypeService.FindOne(t => t.guid == ingredient.ingredientID);
        let available = this.GetAvailableUnitsForType(type);

        if (ingredient.ingredientID == '4707021c-787b-8dd7-292b-71ee0e5b1c29')
            console.log('asd');

        return available.find(u => u.id == ingredient.unit) == undefined;
    }


}
