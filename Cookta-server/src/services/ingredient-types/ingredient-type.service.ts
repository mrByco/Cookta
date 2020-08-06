import {IngredientType} from '../../models/ingredient-type/ingredient-type.model';
import {IIngredientTypeService} from './ingredient-type.service.interface';
import {Guid} from 'guid-typescript';
import {ObjectId} from 'mongodb';
import {StoreService} from 'atomik/lib/store-service/store-service';
import {IFieldConverter} from 'atomik/lib/store-item/field.converter.interface';
import {Food} from '../../models/food/food.model';
import {Services} from '../../Services';
import {EssentialSection} from '../../models/essentials/essential-list.model';
import {StorageSection} from '../../models/storage-section.model';
import {Unit} from '../../models/unit/unit.model';
import {IUnit} from 'cookta-shared/src/models/unit/unit.interface';
import {IIngredientType} from 'cookta-shared/src/models/ingredient-type/ingredient-type.interface';
import {IIngredient} from 'cookta-shared/src/models/ingredient/ingredient.interface';
import {IIngredientDependendentObject} from '../../interfaces/ingredient-dependency-object.interface';
import {EUnitType} from 'cookta-shared/src/models/unit/unit-type.enum';
import {ISetIngredientTypeRequest} from 'cookta-shared/src/contracts/ingredient-type/set.ingredient-type.request';


const NO_DESCENDENT = 'NO_DESCENDENT_OR_FORCED';

export class IngredientTypeService extends StoreService<IngredientType> implements IIngredientTypeService {

    private readonly returnSame: (any) => any = (d) => d;
    public Converters: IFieldConverter[] = [
        {
            DatabaseFieldName: 'volume-enabled',
            ClassFieldName: 'volumeEnabled',
            Convert: this.returnSame,
            ConvertBack: this.returnSame
        },
        {
            DatabaseFieldName: 'mass-enabled',
            ClassFieldName: 'massEnabled',
            Convert: this.returnSame,
            ConvertBack: this.returnSame
        },
        {
            DatabaseFieldName: 'count-enabled',
            ClassFieldName: 'countEnabled',
            Convert: this.returnSame,
            ConvertBack: this.returnSame
        },
    ];


    GetIngredientReferenceCount(id: string, ingredientDependendents: IIngredientDependendentObject): Promise<number> {
        let referenceCount = 0;
        for (let essentialSection of ingredientDependendents.essentials) {
            referenceCount += essentialSection.Essentials.filter(i => i.ingredientID == id).length;
        }
        for (let storageSection of ingredientDependendents.storages) {
            if (storageSection.Items) {
                referenceCount += storageSection.Items.filter(i => i.ingredientID == id).length;
            }
        }
        for (let food of ingredientDependendents.foods) {
            referenceCount += food.ingredients.filter(i => i.ingredientID == id).length;
        }
        return Promise.resolve(referenceCount);
    }

    GetAllNotArhived(): IIngredientType[] {
        return this.FindAll(i => i.arhived != true);
    }

    UpdateIngredient(request: ISetIngredientTypeRequest): IngredientType {
        let guid: Guid = request.guid ? Guid.parse(request.guid) : undefined;
        while (!guid) {
            guid = Guid.create();
            if (this.Items.find(e => e.guid == guid.toString())) {
                guid = undefined;
            }
        }
        let currentItem = this.FindOne(i => i.guid == guid.toString());
        if (!currentItem) {
            currentItem = this.CreateItem(new ObjectId());
        }
        currentItem.category = request.category;
        currentItem.name = request.name;
        currentItem.volumeEnabled = request.volumeEnabled;
        currentItem.countEnabled = request.countEnabled;
        currentItem.massEnabled = request.massEnabled;
        currentItem.guid = guid.toString();
        currentItem.options = request.options;
        currentItem.nutrientCode = request.nutrientCode;
        this.SaveItem(currentItem);
        return currentItem;
    }

    public async CheckUnitReferences(unitId: string): Promise<{ foods: number; essentials: number; storage: number }> {
        let ref = await this.GetReferencesOfUnit(unitId);
        return {essentials: ref.essentials.length, foods: ref.foods.length, storage: ref.storage.length};
    }

    public async DeleteCustomUnit(ingredientId: string, unitId: string, descendentUnitId?: string): Promise<void> {

        let ingredientType = this.FindOne(i => i.guid == ingredientId);
        if (!ingredientType) {
            throw new Error('Ingredient type not exist.').name = 'NOT_EXIST';
        }
        let unitToDelete = ingredientType.options.cunits.find(i => i.id == unitId);
        if (!unitToDelete) {
            throw new Error(`Unit: ${Unit} not found in ${ingredientType.options.cunits}.`).name = 'NOT_EXIST';
        }
        let descendentUnit = undefined;
        if (descendentUnitId) {
            descendentUnit = Services.UnitService.GetAvailableUnitsForType(ingredientType)
                .find(d => d.id == descendentUnitId);
            if (!descendentUnit) {
                throw new Error(`Unit ${unitId} no exist on type: ${ingredientType}`).name = 'NOT_EXIST';
            }
        } else {
            descendentUnit = Unit.GetBaseUnitOf(unitToDelete.type);
        }
        let references = await this.GetReferencesOfUnit(unitId);
        for (let food of references.foods) {
            this.ReplaceOrDeleteUnitOnList(food.ingredients, unitId, descendentUnit);
            await Services.FoodService.SaveFood(food);
        }
        for (let essentials of references.essentials) {
            this.ReplaceOrDeleteUnitOnList(essentials.Essentials, unitId, descendentUnit);
            await Services.EssentialsService.SaveItem(essentials);
        }
        for (let storageSection of references.storage) {
            this.ReplaceOrDeleteUnitOnList(storageSection.Items, unitId, descendentUnit);
            await Services.StorageService.SaveItem(storageSection);
        }

        references = await this.GetReferencesOfUnit(unitId);
        if ((references.essentials.length + references.storage.length + references.foods.length) != 0) {
            throw new Error('Can not solve unit references! Deletion canceled...');
        }
        ingredientType.options.cunits.splice(ingredientType.options.cunits.findIndex(u => u.id == unitId), 1);
        await this.SaveItem(ingredientType);
        return;
    }

    protected FromSaveJson(doc: any): IngredientType {
        let ingType = super.FromSaveJson(doc);
        if (!ingType.options?.cunits) {
            ingType.options = {cunits: []};
        }
        for (let cunit of ingType.options.cunits) {
            if (ingType.countEnabled) cunit.type = EUnitType.COUNT;
            else if (ingType.massEnabled) cunit.type = EUnitType.MASS;
            else if (ingType.volumeEnabled) cunit.type = EUnitType.VOLUME;
        }
        return ingType;
    }

    //returns if the list has been modified

    async DeleteIngredientType(guid: string, forced: boolean, descendentId: string, ingredientDependents: IIngredientDependendentObject): Promise<boolean> {
        let descendent = descendentId ? this.FindOne(i => i.guid == descendentId) : undefined;
        try {
            for (let essentialSection of ingredientDependents.essentials) {
                let modified = this.ProcessDeleteOnList(essentialSection.Essentials, descendent, guid, forced);
                if (modified) {
                    await Services.EssentialsService.SaveItem(essentialSection as EssentialSection);
                }
            }
            for (let storageSection of ingredientDependents.storages) {
                let modified = this.ProcessDeleteOnList(storageSection.Items ? storageSection.Items : [], descendent, guid, forced);
                if (modified) {
                    await Services.StorageService.SaveItem(storageSection as StorageSection);
                }
            }
            for (let food of ingredientDependents.foods) {
                let modified = this.ProcessDeleteOnList(food.ingredients, descendent, guid, forced);
                if (modified) {
                    await Services.FoodService.SaveFood(food);
                }
            }
        } catch (error) {
            if (error.name == NO_DESCENDENT) {
                return false;
            } else {
                console.error(error);
                throw error;
            }
        }

        let item = this.Items.find(i => i.guid == guid);

        if (item)
        await this.RemoveItemAsync(item);
        return true;
    }

    private ReplaceOrDeleteUnitOnList(ingredients: IIngredient[], unitToChange: string, descendent: Unit) {
        if (!ingredients) {
            return;
        }
        for (let ing of ingredients) {
            if (ing.unit != unitToChange) {
                continue;
            }
            let type = Services.IngredientTypeService.FindOne(i => i.guid == ing.ingredientID);
            let oldUnit: IUnit = Services.UnitService.GetAvailableUnitsForType(type).find(i => i.id == ing.unit);
            ingredients[ingredients.indexOf(ing)] = {
                ingredientID: ing.ingredientID,
                unit: descendent.id,
                value: ing.value * oldUnit.tobase / descendent.tobase,
            };
        }
    }


    //throw error if ingredient not deletable
    private ProcessDeleteOnList(ingredients: IIngredient[], descendent: IIngredientType, searchIngredientId: string, forced: boolean): boolean {
        let modified: boolean;
        for (let ing of ingredients) {
            if (ing.ingredientID != searchIngredientId) {
                continue;
            }


            if (descendent) {
                let availableUnits = Services.UnitService.GetAvailableUnitsForType(descendent);
                if (availableUnits.find(u => u.id == ing.unit)) {
                    ing.ingredientID = descendent.guid;
                    modified = true;
                    continue;
                }

                let currentUnit: IUnit = Services.UnitService.FindOne(u => u.id == ing.unit);
                let descendentUnitType = descendent.massEnabled ? EUnitType.MASS : descendent.volumeEnabled ? EUnitType.VOLUME : EUnitType.COUNT;
                //Check if they has same ingredient type and they switch to common base unit
                if (currentUnit.type == descendentUnitType) {
                    ingredients[ingredients.indexOf(ing)] =
                        {
                            ingredientID: descendent.guid,
                            unit: Unit.GetBaseUnitOf(currentUnit.type).id,
                            value: ing.value * currentUnit.tobase
                        };
                    continue;
                }
                throw new Error('Descendent is not in same base unit');
            } else if (!forced) {
                let error = new Error('Ingredient has no descendent');
                error.name = NO_DESCENDENT;
                throw error;
            } else {
                ingredients.splice(ingredients.indexOf(ing), 1);
                modified = true;
            }
        }
        return modified;
    }


    private async GetReferencesOfUnit(unitId: string): Promise<{ foods: Food[], essentials: EssentialSection[], storage: StorageSection[] }> {
        let foods = (await Services.FoodService.GetAllFoods({}))
            .filter(f => f.ingredients.find(i => i.unit == unitId));
        let essentials = Services.EssentialsService.GetAllItems()
            .filter(e => e.Essentials.find(i => i.unit == unitId));
        let storage = Services.StorageService.GetAllItems()
            .filter(s => s.Items?.find(i => i.unit == unitId));
        return {foods: foods, essentials: essentials, storage: storage};
    }


}
