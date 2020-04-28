import {IngredientTypeService} from "./ingredient-type.service";

import * as chai from 'chai';
import {IngredientType} from "../../models/ingredient-type/ingredient-type.model";
import {CIng, SampleEssentials, SampleFunctions, SampleStorage, SIngType, SUnit} from "../../sample.data";
import {Services} from "../../Services";
import {ObjectID} from 'mongodb';
import {UnitService} from "../unit/unit.service";

chai.use(require('chai-spies'));

let expect = chai.expect;


describe('Ingredient type service', function () {
    let service: IngredientTypeService;

    beforeEach(() => {
        // @ts-ignore
        IngredientTypeService.prototype.Items = [];
        service = new IngredientTypeService(i => new IngredientType(i), undefined);
        SampleFunctions.CreateSampleIngredients(service);


        //Should not call mongodb on item delete;
        // @ts-ignore
        service.RemoveItem = (item) => service.Items.splice(service.Items.findIndex(i => i.guid == item.guid), 1);
        // @ts-ignore
        service.RemoveItemAsync = (item) => service.Items.splice(service.Items.findIndex(i => i.guid == item.guid), 1);
    });

    it('should filled with ingredients', function () {
        expect(service.GetAllItems().length).to.be.equal(SIngType.All.length);
    });

    it('should count type references', async function () {
        let sampleEssentials = SampleEssentials.Essentials;
        let sampleStorages = SampleStorage.Storage;
        sampleEssentials.Essentials.push(CIng(5, SUnit.kg, SIngType.bread));

        expect(await service.GetIngredientReferenceCount(SIngType.bread.guid,
            {essentials: [sampleEssentials], storages: [sampleStorages, sampleStorages], foods: []})).to.be.eql(4);
    });

    it('should delete ingredient dependents if forced', async function () {
        let sampleEssentials = SampleEssentials.Essentials;

        Services.EssentialsService = {SaveItem: () => console.log('Cool function')} as any;
        let essentialsServiceSpy = chai.spy.on(Services.EssentialsService, 'SaveItem');

        await service.DeleteIngredientType(SIngType.bread.guid, true, undefined, {
            essentials: [sampleEssentials],
            storages: [],
            foods: []
        })

        chai.expect(essentialsServiceSpy.__spy.calls[0][0].Essentials
            .find(i => i.ingredientID == SIngType.bread.guid)).to.be.equal(undefined);
        chai.expect(essentialsServiceSpy.__spy.calls[0][0].Essentials.length).to.be
            .equal(SampleEssentials.Essentials.Essentials.length - 1);
    });

    it('should delete ingredientType', async function () {
        let sampleEssentials = SampleEssentials.Essentials;

        let success = await service.DeleteIngredientType(SIngType.bread.guid, true, undefined, {
            essentials: [sampleEssentials],
            storages: [],
            foods: []
        })


        expect(service.FindOne(i => i.guid == SIngType.bread.guid)).to.be.equal(undefined);
        expect(success).to.be.equal(true);
        expect(service.GetAllItems().length).to.be.equal(SIngType.All.length - 1);
    });

    it('should not delete ingredientType if there is references but no descendent with same base type', function () {
        let sampleEssentials = SampleEssentials.Essentials;

        service.DeleteIngredientType(SIngType.bread.guid, false, undefined, {
            essentials: [sampleEssentials],
            storages: [],
            foods: []
        })

        expect(service.FindOne(i => i.guid == SIngType.bread.guid)).to.be.not.equal(undefined);
    });

    it('should replace dependents if there is descendent', function () {
        let sampleEssentials = SampleEssentials.Essentials;
        SampleFunctions.SetupTestUnitService();

        Services.EssentialsService = {SaveItem: () => console.log('Cool function')} as any;

        let breadIndex = sampleEssentials.Essentials.findIndex(i => i.ingredientID == SIngType.bread.guid);

        let newBread = service.CreateItem(new ObjectID());
        const guid = '4656c73e-ac13-461e-9710-2f8b893c6be2';
        newBread.guid = guid;
        newBread.massEnabled = true;

        service.DeleteIngredientType(SIngType.bread.guid, true, guid, {
            essentials: [sampleEssentials],
            storages: [],
            foods: []
        })
        console.log(breadIndex)
        console.log(sampleEssentials);
        expect(sampleEssentials.Essentials[breadIndex].ingredientID).to.be.equal(newBread.guid);
    });


    it('should throw error not same type ingredients', async function () {
        let sampleEssentials = SampleEssentials.Essentials;
        SampleFunctions.SetupTestUnitService();

        Services.EssentialsService = {SaveItem: () => console.log('Cool function')} as any;

        let newBread = service.CreateItem(new ObjectID());
        const guid = '4656c73e-ac13-461e-9710-2f8b893c6be2';
        newBread.guid = guid;
        newBread.countEnabled = true;

        let thrown = false;
        try {
            await service.DeleteIngredientType(SIngType.bread.guid, true, guid, {
                essentials: [sampleEssentials],
                storages: [],
                foods: []
            });
        }catch {
            thrown = true;
        }
        expect(thrown).to.be.equal(true);
    });
});
