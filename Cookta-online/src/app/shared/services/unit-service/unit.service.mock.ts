import {Unit} from '../../models/unit.interface';
import {IIngredientType} from '../../models/grocery/ingredient-type.interface';
import {Guid} from 'guid-typescript';
import {UnitService} from './unit.service';
import {EUnitType} from '../../models/grocery/unit-type.enum';
import {IngredientType} from '../../models/grocery/ingredient-type.model';

export class MockUnitService extends UnitService {

  LastLoadedUnits: Unit[] = [];

  constructor() {
    super(null, null);
  }

  public static GenerateRandomUnits(count: number, ofUnitType?: EUnitType): Unit[] {
    let units: Unit[] = [];
    let getRandomInt = (max: number) => {
      return Math.floor(Math.random() * Math.floor(max));
    };

    for (let i = 0; i < count; i++) {
      let id = Guid.create().toString();
      let name = Guid.create().toString();
      let shortname = Guid.create().toString();
      let tobase = Math.random() * 20;
      let type: EUnitType = ofUnitType ?? getRandomInt(2);

      units.push({id: id, name: name, shortname: shortname, tobase: tobase, type: type});
    }
    return units;
  }

  public async LoadUnits(): Promise<Unit[]> {
    return new Promise(async (resolve) => {
      let units: Unit[] = MockUnitService.GenerateRandomUnits(30);
      console.log(units.length + ' units loaded');

      this.LastLoadedUnits = units;
      resolve(units);
    });

  }

  GetAvailableUnitsFor(type: IIngredientType): Unit[] {
    let units = this.LastLoadedUnits;

    units = units.filter(unit => unit.type == type.baseUnitType);

    try {
      units = units.concat(type.options.cunits);
    } catch {
    }
    return units;
  }

  public GetRandomUnit(): Unit {
    return this.LastLoadedUnits[Math.floor(Math.random() * Math.floor(this.LastLoadedUnits.length))];
  }

  public GetRandomUnitOfIngredient(type: IngredientType): Unit {
    let units = this.GetAvailableUnitsFor(type);
    return units[Math.floor(Math.random() * Math.floor(units.length))];
  }


}
