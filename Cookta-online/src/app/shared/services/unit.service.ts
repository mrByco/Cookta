import {IngredientType} from '../models/grocery/ingredient-type.model';
import {Routes} from "../routes";
import {ServerService} from "./server.service";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Unit} from "../models/unit.interface";
import {EUnitType} from "../models/grocery/unit-type.enum";

@Injectable()
export class UnitService {
  public Units: Promise<Unit[]>;
  public LastLoadedUnits: Unit[];


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
        this.LastLoadedUnits = units;
        resolve(units);
      }, error => {
        resolve([]);
      });
    });

  }

  public async GetUnitAsync(id: string, ofType?: IngredientType): Promise<Unit>{
    let units = await this.Units;


    try{
      units = units.concat(ofType.options.cunits);
    }
    finally {
      return units.find(type => type.id == id);
    }

  }
  public GetUnit(id: string, ofType?: IngredientType): Unit{
    let units = this.LastLoadedUnits;


    try{
      units = units.concat(ofType.options.cunits);
    }
    finally {
      return units.find(type => type.id == id);
    }

  }

  public async GetAvailableUnitsFor(CurrentType: IngredientType): Promise<Unit[]> {
    let units = await this.Units;

    units = units.filter(unit => unit.type == CurrentType.baseUnitType);

    try{
      units = units.concat(CurrentType.options.cunits);
    }
    finally {
      return units;
    }
  }

  public static IsValidUnitName(name: string): string | undefined{
    if (name.length < 2)
      return "Minimum 2 character"
    if (name.length > 20)
      return "Max 20 character"
  }
  public static IsValidToBase(toBase: number): string | undefined{
    if (toBase <= 0)
      return "Must larger than 0";
  }

}
