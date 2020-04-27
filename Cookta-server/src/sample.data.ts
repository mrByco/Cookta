import {EUnitType} from "cookta-shared/dist/models/unit/unit-type.enum";
import {IUnit} from "cookta-shared/dist/models/unit/unit.interface";
import {IEssentialSection} from "./models/essentials/essential-list.interface";
import {IStorageSection} from "./interfaces/IStorageSectionRequest";
import {ObjectId} from 'mongodb';
import {IIngredientType} from "cookta-shared/dist/models/ingredient-type/ingredient-type.interface";
import {IIngredient} from "cookta-shared/dist/models/ingredient/ingredient.interface";
import {IngredientTypeService} from "./services/ingredient-types/ingredient-type.service";

export function CIng(quantity: number, unit: IUnit, type: IIngredientType): IIngredient {
    return {ingredientID: type.guid, unit: unit.id, value: quantity};
}

export class SIngType {
    public static readonly bread: IIngredientType = {
        name: 'bread',
        category: 'base',
        countEnabled: false,
        massEnabled: true,
        volumeEnabled: false,
        guid: 'asd1',
        options: {cunits: [{name: 'piece', id: 'p', shortname: "piece", tobase: 500, type: EUnitType.MASS}]}
    };
    public static readonly milk: IIngredientType = {
        name: 'milk', category: 'base', countEnabled: false, massEnabled: false, volumeEnabled: true,
        guid: 'asd2', options: {cunits: [{name: 'cup', id: 'c', shortname: "cup", tobase: 0.2, type: EUnitType.VOLUME}]}
    };
    public static readonly spice: IIngredientType = {
        name: 'spice', category: 'base', countEnabled: false, massEnabled: true, volumeEnabled: false,
        guid: 'asd3', options: {cunits: []}
    };
    public static readonly butter: IIngredientType = {
        name: 'butter',
        category: 'base',
        countEnabled: false,
        massEnabled: true,
        volumeEnabled: false,
        guid: 'asd4',
        options: {cunits: [{name: 'knife', id: 'p', shortname: "knife", tobase: 20, type: EUnitType.MASS}]}
    };
    public static readonly chocolate: IIngredientType = {
        name: 'chocolate', category: 'base', countEnabled: true, massEnabled: false, volumeEnabled: false,
        guid: 'asd5', options: {cunits: []}
    };
    public static readonly All: IIngredientType[] = [
        SIngType.bread, SIngType.butter, SIngType.chocolate, SIngType.milk, SIngType.spice
    ]
}

export class SUnit {
    public static readonly dkg: IUnit = {
        name: 'dekagramm',
        type: EUnitType.MASS,
        tobase: 10,
        shortname: 'dkg',
        id: '5ea2a0f6a380ce7c48fb8462'
    };
    public static readonly g: IUnit = {
        name: 'gramm',
        type: EUnitType.MASS,
        tobase: 1,
        shortname: 'g',
        id: '5ea2a11cb7ff30dbce2f5035'
    };
    public static readonly kg: IUnit = {
        name: 'kilogramm',
        type: EUnitType.MASS,
        tobase: 1000,
        shortname: 'kg',
        id: '5ea2a11f2e5941162e2f14cf'
    };
    public static readonly l: IUnit = {
        name: 'liter',
        type: EUnitType.VOLUME,
        tobase: 1,
        shortname: 'l',
        id: '5ea2a12e70574e9a84ffe2e1'
    };
    public static readonly dl: IUnit = {
        name: 'deciliter',
        type: EUnitType.MASS,
        tobase: 0.10,
        shortname: 'dl',
        id: '5ea2a134b4fb399986257b73'
    };
    public static readonly db: IUnit = {
        name: 'darab',
        type: EUnitType.COUNT,
        tobase: 10,
        shortname: 'db',
        id: '5ea2a13829e4c5c55a421f23'
    }
    public static readonly All: IUnit[] = [
        SUnit.dkg, SUnit.kg, SUnit.g, SUnit.l, SUnit.dl, SUnit.db
    ]
}

export class SampleEssentials {
    public static get Essentials(): IEssentialSection {
        return Object.assign({}, {
            Essentials: [
                CIng(3, SUnit.kg, SIngType.bread),
                CIng(5, SUnit.l, SIngType.milk),
                CIng(15, SUnit.g, SIngType.spice),
                CIng(2, SUnit.db, SIngType.chocolate),
            ],
            FamilyId: "5ea2affb842c39ad59a8bb8b"
        })
    }
}

export class SampleStorage {
    public static get Storage(): IStorageSection {
        return Object.assign({}, {
            FamilyId: "5ea2affb842c39ad59a8bb8b",
            Id: new ObjectId('5ea2b2721fc94eaf5955ebf6'),
            IsDefaultList: false,
            Items: [
                CIng(3, SUnit.kg, SIngType.bread),
                CIng(5, SUnit.l, SIngType.milk),
                CIng(15, SUnit.g, SIngType.spice),
                CIng(2, SUnit.db, SIngType.chocolate),
            ],
            Name: "Fridge"
        });
    }
}

export const SampleFunctions = {

    CreateSampleIngredients: (ingService: IngredientTypeService) => {
        for (let i of SIngType.All) {
            let fresh = ingService.CreateItem(new ObjectId());
            fresh.name = i.name;
            fresh.arhived = i.arhived;
            fresh.category = i.category;
            fresh.countEnabled = i.countEnabled;
            fresh.volumeEnabled = i.volumeEnabled;
            fresh.massEnabled = i.massEnabled;
            fresh.guid = i.guid;
            fresh.options = i.options;
        }
    }
}
