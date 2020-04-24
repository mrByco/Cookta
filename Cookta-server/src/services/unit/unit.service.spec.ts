import {Services} from "../../Services";
import {UnitService} from "./unit.service";
import {Unit} from "../../models/unit/unit.model";
import {IUnit} from "../../../../Cookta-shared/src/models/unit/unit.interface";
import {ObjectId} from 'mongodb';
import * as chai from 'chai';
import {IIngredientType} from "../../models/ingredient-type/ingredient-type.interface";
import {CIng, SampleEssentials, SampleStorage, SIngType, SUnit} from "../../sample.data";
import {IngredientTypeService} from "../ingredient-types/ingredient-type.service";
import {IngredientType} from "../../models/ingredient-type/ingredient-type.model";
import {IBadUnit} from "../../../../Cookta-shared/src/models/unit/bad-unit.interface";

const sampleUnits: IUnit[] = SUnit.All;


const sampleIngredientType: IIngredientType = SIngType.bread;


function AddUnitToUnitService(unitService: UnitService, unit: IUnit){
    let fresh = unitService.CreateItem(new ObjectId(unit.id));
    fresh.name = unit.name;
    fresh.shortname = unit.shortname;
    fresh.tobase = unit.tobase;
    fresh.type = unit.type;
    fresh.id = unit.id;
}
function CreateSampleUnits(unitService: UnitService){
    for (let u of sampleUnits){
        AddUnitToUnitService(unitService, u);
    }
}
function CreateSampleIngredients(ingService: IngredientTypeService){
    for (let i of SIngType.All){
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


describe('Unit service', function () {
    let service: UnitService;
    beforeEach(() => {
        // @ts-ignore
        UnitService.prototype.Items = [];
        service = new UnitService(i => new Unit(i), 'empty');
        Services.UnitService = service;
        CreateSampleUnits(service);
    });

    it('should return units', function () {
        let items = JSON.parse(JSON.stringify(service.GetAllItems()));
        items.forEach(i => delete(i._id));
        chai.expect(items).to.have.deep.members(sampleUnits);
    });

    it('should return empty if no bad units', async function () {
        service = new UnitService(i => new Unit(i), 'empty');
        Services.UnitService = service;

        // @ts-ignore
        IngredientTypeService.prototype.Items = [];
        let ingService = new IngredientTypeService(i => new IngredientType(i), 'empty');
        Services.IngredientTypeService = ingService;
        CreateSampleIngredients(ingService);

        let badUnits = await service.GetBadUnitReferences([SampleEssentials.Essentials], [SampleStorage.Storage], []);
        chai.expect(badUnits).to.deep.equal([]);
    });

    it('should return empty if no bad units', async function () {
        service = new UnitService(i => new Unit(i), 'empty');
        Services.UnitService = service;

        // @ts-ignore
        IngredientTypeService.prototype.Items = [];
        let ingService = new IngredientTypeService(i => new IngredientType(i), 'empty');
        Services.IngredientTypeService = ingService;
        CreateSampleIngredients(ingService);

        let essentials = SampleEssentials.Essentials;
        essentials.Essentials.push(CIng(4, SUnit.l, SIngType.bread))

        let badUnits = await service.GetBadUnitReferences([essentials], [SampleStorage.Storage], []);
        let badUnitsExpected: IBadUnit[] = [{IngredientId: SIngType.bread.guid, UnitId: SUnit.l.id, Count: 1}]
        chai.expect(badUnits).to.deep.equal(badUnitsExpected);
    });
});
