import {IStoreService} from 'atomik/lib/store-service/store-service-interface';
import {Unit} from '../../models/unit/unit.model';
import {IUnit} from "cookta-shared/src/models/unit/unit.interface";
import {IEssentialSection} from "../../models/essentials/essential-list.interface";
import {IStorageSection} from "cookta-shared/contracts/stock/IStorageSectionRequest";
import {Food} from "../../models/food/food.model";
import {EssentialSection} from "../../models/essentials/essential-list.model";
import {StorageSection} from "../../models/storage-section.model";
import {IIngredientType} from "cookta-shared/src/models/ingredient-type/ingredient-type.interface";
import {IBadUnit} from "cookta-shared/src/models/unit/bad-unit.interface";

export interface IUnitService extends IStoreService<Unit> {

    GetAvailableUnitsForType(type: IIngredientType): IUnit[];

    GetBadUnitReferences(essentials: IEssentialSection[], storages: IStorageSection[], foods: Food[]): Promise<IBadUnit[]>;

    FixBadUnit(unitId: string, ingredientId: string, fixUnit: IUnit, fixMultiplier: number, essentialSections: EssentialSection[], storageSections: StorageSection[], foods: Food[]): Promise<boolean>;
}
