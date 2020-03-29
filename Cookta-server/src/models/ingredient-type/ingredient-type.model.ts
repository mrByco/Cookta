import {IUnit} from "../unit/unit.interface";
import {MongoHelper} from "../../helpers/mongo.helper";
import {ISetIngredientTypeRequest} from "../../requests/set.ingredient-type.request";
import {Guid} from "guid-typescript";
import {IIngredientType} from "./ingredient-type.interface";
import {StoreItemBase} from "atomik/lib/store-item/store-item-base";

export class IngredientType extends StoreItemBase implements IIngredientType {


    public category: string = null;
    public name: string = null;
    public volumeEnabled: boolean = null;
    public countEnabled: boolean = null;
    public massEnabled: boolean = null;
    public guid: string = null;
    public options: { cunits: IUnit[]} = null;
    public arhived: boolean = null;

}
