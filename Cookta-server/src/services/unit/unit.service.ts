import {StoreService} from "atomik/store-service/store-service";
import {IUnitService} from "./unit.service.interface";
import {Unit} from "../../models/unit/unit.model";

export class UnitService extends StoreService<Unit> implements IUnitService{

}
