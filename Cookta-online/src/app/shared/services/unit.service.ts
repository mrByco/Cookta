import {IngredientType} from '../models/grocery/ingredient-type.model';
import {Routes} from "../routes";
import {ServerService} from "./server.service";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Unit} from "../models/unit.interface";

@Injectable()
export class UnitService {
  public Units: Promise<Unit[]>;

  constructor(
    private serverService: ServerService,
    private http: HttpClient
  ) {
    this.Units = this.LoadUnits();
  }

  public async LoadUnits(): Promise<Unit[]>{

    return new Promise(async (resolve, reject) => {
      let response = await this.http.get(this.serverService.GetBase() + Routes.Unit.GetAll);
      let units: Unit[] = [];
      response.subscribe(data => {
        for (const d of (data as any)){
          units.push(d);
        }
        resolve(units);
      }, error => {
        resolve([]);
      });
    });

  }

  public async GetUnit(id: string, ofType?: IngredientType): Promise<Unit>{
    let units = await this.Units;


    try{
      units = units.concat(ofType.options.cunits);
    }
    finally {
      return units.find(type => type.id == id);
    }

  }

  public async GetAvailableUnitsFor(CurrentType: IngredientType): Promise<Unit[]> {
    let units = await this.Units;

    units = units.filter((unit) => {
      switch (unit.type) {
        case 0:
          return CurrentType.volumeEnabled;
        case 1:
          return CurrentType.CountEnabled;
        case 2:
          return CurrentType.massEnabled;
      }
    });

    try{
      units = units.concat(CurrentType.options.cunits);
    }
    finally {
      return units;
    }
  }
}
