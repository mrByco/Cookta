import {IngredientType} from '../../models/ingredient-type/ingredient-type.model';
import {IIngredientTypeService} from './ingredient-type.service.interface';
import {IIngredientType} from '../../models/ingredient-type/ingredient-type.interface';
import {ISetIngredientTypeRequest} from '../../requests/set.ingredient-type.request';
import {Guid} from 'guid-typescript';
import {ObjectId} from 'mongodb';
import {StoreService} from 'atomik/lib/store-service/store-service';
import {IFieldConverter} from 'atomik/lib/store-item/field.converter.interface';
import {Food} from '../../models/food/food.model';
import {Services} from '../../Services';
import {EssentialList} from '../../models/essential-list.model';
import {StorageSection} from '../../models/storage-section.model';
import {IIngredient} from '../../interfaces/IIngredient';
import {Unit} from '../../models/unit/unit.model';

export class IngredientTypeService extends StoreService<IngredientType> implements IIngredientTypeService {

    DeleteIngredientType(guid: string): boolean {
        let item = this.Items.find(i => i.guid);
        if (!item) {
            return false;
        }
        item.arhived = true;
        this.SaveItem(item);
        return true;
    }

    GetAllNotArhived(): IIngredientType[] {
        return this.FindAll(i => i.arhived != true);
    }

    SetIngredientType(request: ISetIngredientTypeRequest): IngredientType {
        let guid: Guid = request.guid ? Guid.parse(request.guid) : undefined;
        while (!guid) {
            guid = Guid.create();
            if (this.Items.find(e => e.guid == guid.toString()))
                guid = undefined;
        }
        let currentItem = this.FindOne(i => i.guid == guid.toString());
        if (!currentItem){
            currentItem = this.CreateItem(new ObjectId());
        }
        currentItem.category = request.category;
        currentItem.name = request.name;
        currentItem.volumeEnabled = request.volumeEnabled;
        currentItem.countEnabled = request.countEnabled;
        currentItem.massEnabled = request.massEnabled;
        currentItem.guid = guid.toString();
        currentItem.options = request.options;
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
        let descendentUnit = undefined;
        if (descendentUnitId) {
            descendentUnit = Services.UnitService.GetAvailableUnitsForType(ingredientType)
                .find(d => d.id == unitId);
            if (!descendentUnit) {
                throw new Error(`Unit ${unitId} no exist on type: ${ingredientType}`).name = 'NOT_EXIST';
            }
        }
        let references = await this.GetReferencesOfUnit(unitId);

        for (let food of references.foods) {
            this.ReplaceOrDeleteUnitOnList(food.ingredients, descendentUnit);
            await food.Save();
        }
        for (let essentials of references.essentials) {
            this.ReplaceOrDeleteUnitOnList(essentials.Essentials, descendentUnit);
            await Services.EssentialsService.SaveItem(essentials);
        }
        for (let storageSection of references.storage) {
            this.ReplaceOrDeleteUnitOnList(storageSection.Items, descendentUnit);
            await Services.StorageService.SaveItem(storageSection);
        }
        return;
    }

    protected FromSaveJson(doc: any): IngredientType {
        let ingType = super.FromSaveJson(doc);
        if (ingType.options == null) {
            ingType.options = {cunits: []};
        }
        return ingType;

    }

    private ReplaceOrDeleteUnitOnList(ingredients: IIngredient[], descendent?: Unit) {
        throw new Error('Not implemented');
        //TODO Implement this.
        //TODO Work on original list!!
    }

    private readonly returnSame: (any) => any = (d) => d;

    public Converters: IFieldConverter[] = [
        {DatabaseFieldName: 'volume-enabled', ClassFieldName: 'volumeEnabled', Convert: this.returnSame, ConvertBack: this.returnSame},
        {DatabaseFieldName: 'mass-enabled', ClassFieldName: 'massEnabled', Convert: this.returnSame, ConvertBack: this.returnSame},
        {DatabaseFieldName: 'count-enabled', ClassFieldName: 'countEnabled', Convert: this.returnSame, ConvertBack: this.returnSame},
    ];

    private async GetReferencesOfUnit(unitId: string): Promise<{ foods: Food[], essentials: EssentialList[], storage: StorageSection[] }> {
        let foods = (await Food.GetAllFoods({}))
            .filter(f => f.ingredients.find(i => i.unit == unitId));
        let essentials = Services.EssentialsService.GetAllItems()
            .filter(e => e.Essentials.find(i => i.unit == unitId));
        let storage = Services.StorageService.GetAllItems()
            .filter(s => s.Items?.find(i => i.unit == unitId));
        return {foods: foods, essentials: essentials, storage: storage};
    }


}
