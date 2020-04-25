import {Services} from "../../Services";
import {UnitService} from "./unit.service";
import {Unit} from "../../models/unit/unit.model";
import {IUnit} from "../../../../Cookta-shared/src/models/unit/unit.interface";
import {ObjectId} from 'mongodb';
import * as chai from 'chai';
import {CIng, SampleEssentials, SampleStorage, SIngType, SUnit} from "../../sample.data";
import {IngredientTypeService} from "../ingredient-types/ingredient-type.service";
import {IngredientType} from "../../models/ingredient-type/ingredient-type.model";
import {IBadUnit} from "../../../../Cookta-shared/src/models/unit/bad-unit.interface";

chai.use(require('chai-spies'));

const sampleUnits: IUnit[] = SUnit.All;


function AddUnitToUnitService(unitService: UnitService, unit: IUnit) {
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
    it('should return count bad units', async function () {
        service = new UnitService(i => new Unit(i), 'empty');
        Services.UnitService = service;

        // @ts-ignore
        IngredientTypeService.prototype.Items = [];
        let ingService = new IngredientTypeService(i => new IngredientType(i), 'empty');
        Services.IngredientTypeService = ingService;
        CreateSampleIngredients(ingService);

        let essentials1 = SampleEssentials.Essentials;
        essentials1.Essentials.push(CIng(4, SUnit.l, SIngType.bread));
        let essentials2 = SampleEssentials.Essentials;
        essentials2.Essentials.push(CIng(1, SUnit.l, SIngType.bread));

        let badUnits = await service.GetBadUnitReferences([essentials1, essentials2], [SampleStorage.Storage], []);

        let badUnitsExpected: IBadUnit[] = [{IngredientId: SIngType.bread.guid, UnitId: SUnit.l.id, Count: 2}]
        chai.expect(badUnits).to.deep.equal(badUnitsExpected);
    });

    it('FixBadUnit() should call save functions with good parameters', async function () {
        service = new UnitService(i => new Unit(i), 'empty');
        Services.UnitService = service;

        // @ts-ignore
        IngredientTypeService.prototype.Items = [];
        let ingService = new IngredientTypeService(i => new IngredientType(i), 'empty');
        Services.IngredientTypeService = ingService;
        CreateSampleIngredients(ingService);

        Services.EssentialsService = {SaveItem: () => console.log('Cool function')} as any;
        let essentialsServiceSpy = chai.spy.on(Services.EssentialsService, 'SaveItem');

        let essentials1 = SampleEssentials.Essentials;
        essentials1.Essentials.push(CIng(4, SUnit.l, SIngType.bread));
        let essentials2 = SampleEssentials.Essentials;
        essentials2.Essentials.push(CIng(1, SUnit.l, SIngType.bread));


        await service.FixBadUnit(SUnit.l.id, SIngType.bread.guid, SUnit.dkg, 11, [essentials1, essentials2], [], []);

        console.log(essentialsServiceSpy.__spy.calls[0][0].Essentials);
        console.log('Bread' + SIngType.bread.guid + '||' + SUnit.dkg.id);

        //Saved the ingredients
        chai.expect(Services.EssentialsService.SaveItem).to.have.been.called();

        //Changed ok
        chai.expect(essentialsServiceSpy.__spy.calls[0][0].Essentials
            .find(i => i.ingredientID == SIngType.bread.guid && i.unit == SUnit.dkg.id && i.value == 44)).to.be.ok;

        chai.expect(essentialsServiceSpy.__spy.calls[1][0].Essentials
            .find(i => i.ingredientID == SIngType.bread.guid && i.unit == SUnit.dkg.id && i.value == 11)).to.be.ok;

        //Keep valid ingredients
        for (let ess of SampleEssentials.Essentials.Essentials) {
            chai.expect(essentialsServiceSpy.__spy.calls[0][0].Essentials.find(i => i.ingredientID == ess.ingredientID && i.unit == ess.unit && i.value == ess.value)).to.be.ok;
        }
    });
});
