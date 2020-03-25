import {MongoHelper} from "../helpers/mongo.helper";
import {IIngredient} from "../interfaces/IIngredient";
import {StoreItemBase} from "atomik/store-item/store-item-base";

export class EssentialList extends StoreItemBase{
    public FamilyId: string;
    public Essentials: IIngredient[];
}
