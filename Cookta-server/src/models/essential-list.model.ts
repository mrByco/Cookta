import {IIngredient} from "../interfaces/IIngredient";
import {StoreItemBase} from "atomik/lib/store-item/store-item-base";

export class EssentialList extends StoreItemBase{
    public FamilyId: string = null;
    public Essentials: IIngredient[] = null;
}
