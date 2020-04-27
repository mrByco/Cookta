import {IngredientTypeService} from "./ingredient-type.service";

import * as chai from 'chai';
import {IngredientType} from "../../models/ingredient-type/ingredient-type.model";
import {CIng, SampleEssentials, SampleFunctions, SampleStorage, SIngType, SUnit} from "../../sample.data";

chai.use(require('chai-spies'));

let expect = chai.expect;


describe('Ingredient type service', function () {
    let service: IngredientTypeService;

    beforeEach(() => {
        // @ts-ignore
        IngredientTypeService.prototype.Items = [];
        service = new IngredientTypeService(i => new IngredientType(i), undefined);
        SampleFunctions.CreateSampleIngredients(service);
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
});
