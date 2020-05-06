import {IngredientType} from '../../models/grocery/ingredient-type.model';
import {Routes} from '../../routes';
import {ServerService} from '../server.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Unit} from '../../models/unit.interface';
import {IBadUnit} from "../../../../../../Cookta-shared/src/models/unit/bad-unit.interface";
import {
    FixBadUnitRequest,
    GetBadUnitResponse
} from "../../../../../../Cookta-shared/src/contracts/unit-route/get-bad-units";

@Injectable()
export class UnitService {
    public Units: Promise<Unit[]>;
    public LastLoadedUnits: Unit[] = [];


    constructor(
        private serverService: ServerService,
        private http: HttpClient
    ) {
        //this.Units = this.LoadUnits();
    }

    public static IsValidUnitName(name: string): string | undefined {
        if (name.length < 2) {
            return 'Minimum 2 character';
        }
        if (name.length > 20) {
            return 'Max 20 character';
        }
    }

    public static IsValidToBase(toBase: number): string | undefined {
        if (toBase <= 0) {
            return 'Must larger than 0';
        }
    }

    public async LoadUnits(): Promise<Unit[]> {
        this.Units = new Promise(async (resolve) => {
            let response = await this.http.get(this.serverService.GetBase() + Routes.Unit.GetAll);
            let units: Unit[] = [];
            response.subscribe(data => {
                for (const d of (data as any)) {
                    units.push(d);
                }
                this.LastLoadedUnits = units;
                console.log(units.length + ' units loaded');
                resolve(units);
            }, error => {
                console.log(`Error on loading: ${error}`);
                resolve([]);
            });
        });
        return this.Units;
    }


    public async GetBadUnits(): Promise<IBadUnit[] | null> {
        return new Promise(async (resolve) => {
            let response = await this.serverService.GetRequest(Routes.Unit.GetBads);
            response.subscribe(data => {
                let respData = data as GetBadUnitResponse;
                resolve(respData.badUnits);
            }, error => {
                console.log(`Error on loading: ${error}`);
                console.error(error);
                resolve(null);
            });
        });
    }

    public async FixBadUnit(badUnitToFix: IBadUnit): Promise<IBadUnit[]> {
        return new Promise(async (resolve) => {
            let reqBody: FixBadUnitRequest = {badUnit: badUnitToFix};
            let response = await this.serverService.PostRequest(Routes.Unit.FixBad, reqBody);

            response.subscribe(data => {
                let respData = data as GetBadUnitResponse;
                resolve(respData.badUnits);
            }, error => {
                console.log(`Error on loading: ${error}`);
                console.error(error);
                resolve(null);
            });
        });
    }

    public async GetUnitAsync(id: string, ofType?: IngredientType): Promise<Unit> {
        let units = await this.Units;


        try {
            units = units.concat(ofType.options.cunits);
        } catch {
        }

        return units.find(type => type.id == id);
    }

    public GetUnit(id: string, ofType?: IngredientType): Unit {
        let units = this.LastLoadedUnits;


        try {
            units = units.concat(ofType.options.cunits);
        } catch {
        }
        let u = units.find(type => type.id == id);
        if (!u) {
            console.error('Cannot find unit of: ' + id + '  From: ');
            console.error(units);
        }
        return u;
    }

    public GetDisplayName(id: string) {
        let unit = this.GetUnit(id);
        if (!unit) {
            return 'U:' + id;
        }
        return unit.shortname && unit.shortname != '' ? unit.shortname : unit.name;
    }

    public GetAvailableUnitsFor(CurrentType: IngredientType): Unit[] {
        let units = this.LastLoadedUnits;

        units = units.filter(unit => unit.type == CurrentType.baseUnitType);

        try {
            units = units.concat(CurrentType.options.cunits);
        } catch {
        }

        return units;
    }

}
