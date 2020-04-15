import {Unit} from '../../models/unit.interface';
import {IIngredientType} from '../../models/grocery/ingredient-type.interface';
import {UnitService} from './unit.service';
import {IngredientType} from '../../models/grocery/ingredient-type.model';


export class MockUnitService extends UnitService {


  constructor() {
    super(null, null);
  }


  public async LoadUnits(): Promise<Unit[]> {
    let units: Unit[] = SampleUnitData as Unit[];
    console.log(units.length + ' units loaded');

    this.LastLoadedUnits = units;
    return Promise.resolve(units);

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
    return this.LastLoadedUnits[Math.floor(Math.random() * Math.floor(this.LastLoadedUnits.length - 1))];
  }

  public GetRandomUnitOfIngredient(type: IngredientType): Unit {
    console.log(this.LastLoadedUnits.length);
    let units = this.GetAvailableUnitsFor(type);
    return units[Math.floor(Math.random() * Math.floor(units.length - 1))];
  }


}

const SampleUnitData = [{
  '_id': '5d35541b7dd7d42c54c437ff',
  'type': 2,
  'name': 'gramm',
  'shortname': 'g',
  'tobase': 1,
  'id': 'g'
}, {
  '_id': '5d35541b7dd7d42c54c437fb',
  'type': 0,
  'name': 'liter',
  'shortname': 'l',
  'tobase': 1,
  'id': 'l'
}, {
  '_id': '5d35541b7dd7d42c54c43801',
  'type': 2,
  'name': 'kilogramm',
  'shortname': 'kg',
  'tobase': 1000,
  'id': 'kg'
}, {
  '_id': '5d35541b7dd7d42c54c43800',
  'type': 2,
  'name': 'dekagramm',
  'shortname': 'dkg',
  'tobase': 10,
  'id': 'dkg'
}, {
  '_id': '5d35541b7dd7d42c54c437fe',
  'type': 0,
  'name': 'mililiter',
  'shortname': 'ml',
  'tobase': 0.001,
  'id': 'ml'
}, {
  '_id': '5d35541b7dd7d42c54c43802',
  'type': 1,
  'name': 'darab',
  'shortname': 'db',
  'tobase': 1,
  'id': 'db'
}, {
  '_id': '5d35541b7dd7d42c54c437fc',
  'type': 0,
  'name': 'deciliter',
  'shortname': 'dl',
  'tobase': 0.1,
  'id': 'dl'
}, {
  '_id': '5d35541b7dd7d42c54c43804',
  'type': 1,
  'name': 'szál',
  'shortname': 'szál',
  'tobase': 1,
  'id': 'line'
}, {
  '_id': '5d35541b7dd7d42c54c43803',
  'type': 1,
  'name': 'üveg',
  'shortname': 'üveg',
  'tobase': 1,
  'id': 'glass'
}, {'_id': '5d35541b7dd7d42c54c437fd', 'type': 0, 'name': 'centiliter', 'shortname': 'cl', 'tobase': 0.01, 'id': 'cl'}];
