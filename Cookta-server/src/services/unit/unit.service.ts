import {StoreService} from "atomik/lib/store-service/store-service";
import {IUnitService} from "./unit.service.interface";
import {Unit} from "../../models/unit/unit.model";

export class UnitService extends StoreService<Unit> implements IUnitService{

}
