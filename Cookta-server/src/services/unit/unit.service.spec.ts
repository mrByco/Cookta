import {Services} from "../../Services";
import {UnitService} from "./unit.service";
import {Unit} from "../../models/unit/unit.model";

import * as chai from 'chai';
import {CIng, SampleEssentials, SampleFunctions, SampleStorage, SIngType, SUnit} from "../../sample.data";
import {IngredientTypeService} from "../ingredient-types/ingredient-type.service";
import {IngredientType} from "../../models/ingredient-type/ingredient-type.model";
import {IBadUnit} from "../../../../Cookta-shared/src/models/unit/bad-unit.interface";

chai.use(require('chai-spies'));





describe('Unit service', function () {
    let service: UnitService;
    beforeEach(() => {
        service = SampleFunctions.SetupTestUnitService();
    });

    it('should return units', function () {
        let items = JSON.parse(JSON.stringify(service.GetAllItems()));
        items.forEach(i => delete(i._id));
        chai.expect(items).to.have.deep.members(SUnit.All);
    });

    it('should return empty if no bad units', async function () {
        service = new UnitService(i => new Unit(i), 'empty');
        Services.UnitService = service;

        // @ts-ignore
        IngredientTypeService.prototype.Items = [];
        let ingService = new IngredientTypeService(i => new IngredientType(i), 'empty');
        Services.IngredientTypeService = ingService;
        SampleFunctions.CreateSampleIngredients(ingService);

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
        SampleFunctions.CreateSampleIngredients(ingService);

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
        SampleFunctions.CreateSampleIngredients(ingService);

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
        SampleFunctions.CreateSampleIngredients(ingService);

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
