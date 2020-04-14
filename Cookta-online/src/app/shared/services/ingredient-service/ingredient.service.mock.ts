import {IngredientService} from './ingredient.service';
import {IngredientType} from '../../models/grocery/ingredient-type.model';
import {Guid} from 'guid-typescript';
import {MockUnitService} from '../unit-service/unit.service.mock';
import {EUnitType} from '../../models/grocery/unit-type.enum';

export class MockIngredientService extends IngredientService {

  constructor() {
    super(null, null);
  }

  public async LoadIngredients(): Promise<IngredientType[]> {


    let getRandomInt = (max: number) => {
      return Math.floor(Math.random() * Math.floor(max));
    };

    return new Promise(async resolve => {


      let categories = ['Cat1', 'Cat2', 'Cat3', 'Cat4', 'Cat5', 'Cat6', 'Cat7', 'Cat8'];

      let types: IngredientType[] = [];
      for (let i = 0; i < 400; i++) {
        let mockJson = {};
        mockJson['category'] = categories[getRandomInt(categories.length)];
        mockJson['name'] = Guid.create().toString().replace('-', ' ');
        mockJson['baseUnit'] = undefined;
        mockJson['volumeEnabled'] = false;
        mockJson['massEnabled'] = false;
        mockJson['countEnabled'] = false;
        let unitType: EUnitType;
        switch (getRandomInt(2)) {
          case 0:
            mockJson['volumeEnabled'] = true;
            unitType = EUnitType.volume;
            break;
          case 1:
            mockJson['massEnabled'] = true;
            unitType = EUnitType.mass;
            break;
          case 2:
            mockJson['countEnabled'] = true;
            unitType = EUnitType.count;
            break;
        }
        mockJson['inshopping'] = undefined;
        mockJson['guid'] = Guid.create().toString();
        let customUnits = MockUnitService.GenerateRandomUnits(getRandomInt(5), unitType);
        mockJson['options'] = {cunits: customUnits};
        types.push(IngredientType.FromJson(mockJson));

      }
      console.log(`Generated ${types.length} ingredients`);
      this.LastLoadedTypes = types;
      resolve(types);
    });
  }


  public async SaveIngredient(type: IngredientType): Promise<IngredientType> {
    throw new Error('ingredient.service.mock.ts - SaveIngredient(type: IngredientType) is not integrated in mock service.');
  }


  public GetRandomType(): IngredientType {
    return this.LastLoadedTypes[Math.floor(Math.random() * Math.floor(this.LastLoadedTypes.length))];
  }
}
