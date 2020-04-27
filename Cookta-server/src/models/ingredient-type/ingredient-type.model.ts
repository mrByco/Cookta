import {IIngredientType} from "cookta-shared/dist/models/ingredient-type.interface";
import {StoreItemBase} from "atomik/lib/store-item/store-item-base";
import {IUnit} from "../../../../Cookta-shared/src/models/unit/unit.interface";

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
