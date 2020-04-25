import {IBadUnit} from "../../models/unit/bad-unit.interface";

export interface GetBadUnitResponse {
    badUnits: IBadUnit[];
}

export interface FixBadUnitRequest {
    badUnit: IBadUnit;
}
