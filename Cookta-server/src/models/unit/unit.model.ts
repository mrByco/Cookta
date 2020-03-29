import {IUnit} from "./unit.interface";
import {EUnitType} from "../../enums/unit-type.enum";
import {StoreItemBase} from "atomik/lib/store-item/store-item-base";

export class Unit extends StoreItemBase implements IUnit {

    public type: EUnitType = null;
    public name: string = null;
    public shortname: string =null;
    public tobase: number =null;
    public id: string = null;

}
