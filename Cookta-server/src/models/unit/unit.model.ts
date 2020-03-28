import {IUnit} from "./unit.interface";
import {MongoHelper} from "../../helpers/mongo.helper";
import {EUnitType} from "../../enums/unit-type.enum";
import {StoreItemBase} from "atomik/store-item/store-item-base";

export class Unit extends StoreItemBase implements IUnit {

    public type: EUnitType;
    public name: string;
    public shortname: string;
    public tobase: number;
    public id: string;


}
