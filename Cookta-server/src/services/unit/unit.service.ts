import {StoreService} from 'atomik/lib/store-service/store-service';
import {IUnitService} from './unit.service.interface';
import {Unit} from '../../models/unit/unit.model';
import {IIngredientType} from '../../models/ingredient-type/ingredient-type.interface';
import {IUnit} from "../../../../Cookta-shared/src/models/unit/unit.interface";
import {EUnitType} from "../../../../Cookta-shared/src/models/unit/unit-type.enum";
import {Food} from "../../models/food/food.model";
import {IStorageSection} from "../../interfaces/IStorageSectionRequest";
import {Services} from "../../Services";
import {IIngredient} from "../../interfaces/IIngredient";
import {IEssentialSection} from "../../models/essentials/essential-list.interface";
import {IBadUnit} from "../../../../Cookta-shared/src/models/unit/bad-unit.interface";

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
        }).map(u => u as IUnit).concat(...type.options.cunits);
    }

    async GetBadUnitReferences(essentials: IEssentialSection[], storages: IStorageSection[], foods: Food[]): Promise<IBadUnit[]> {

        let references = await this.GetBadUnitObjects(essentials, storages, foods);

        let badUnits: IBadUnit[] = [];

        for (let food of references.foods){
            for (let ing of food.ingredients){
                this.IncrementUnitInBadUnits(badUnits, ing);
            }
        }
        for (let essentialSection of references.essentials){
            for (let ing of essentialSection.Essentials){
                this.IncrementUnitInBadUnits(badUnits, ing);
            }
        }
        for (let storageSection of references.storageSections){
            for (let ing of storageSection.Items){
                this.IncrementUnitInBadUnits(badUnits, ing);
            }
        }
        return badUnits;
    }

    private async GetBadUnitObjects(essentials: IEssentialSection[], storages: IStorageSection[], foods: Food[]): Promise<{ foods: Food[], storageSections: IStorageSection[], essentials: IEssentialSection[] }>{

        let foodRefs = foods.filter(f => {f.ingredients.find(i => this.IsIngredientInInvalidUnit(i))});

        let essentialRefs = essentials.filter(e => e.Essentials.find(i => this.IsIngredientInInvalidUnit(i)));

        let storageRefs = storages.filter(s => s.Items?.find(i => this.IsIngredientInInvalidUnit(i)));

        return {essentials: essentialRefs, foods: foodRefs, storageSections: storageRefs}
    }

    private IncrementUnitInBadUnits(badUnits: IBadUnit[], ingredient: IIngredient){
        if (badUnits.find(bu => bu.UnitId == ingredient.unit && bu.IngredientId == ingredient.ingredientID)){
            badUnits.find(bu => bu.UnitId == ingredient.unit).Count++;
        }else{
            let unit = this.FindOne(u => u.id == ingredient.unit);
            if (!unit) return;
            badUnits.push({Count: 1, IngredientId: ingredient.ingredientID, UnitId: unit.id});
        }
    }

    private IsIngredientInInvalidUnit(ingredient: IIngredient){
        let type = Services.IngredientTypeService.FindOne(t => t.guid == ingredient.ingredientID);
        let available = this.GetAvailableUnitsForType(type);
        return available.find(u => u.id == ingredient.unit) == undefined;
    }

}
