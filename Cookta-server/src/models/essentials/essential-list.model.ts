import {IIngredient} from "../../interfaces/IIngredient";
import {StoreItemBase} from "atomik/lib/store-item/store-item-base";
import {IEssentialSection} from "./essential-list.interface";

export class EssentialSection extends StoreItemBase implements IEssentialSection {
    public FamilyId: string = null;
    public Essentials: IIngredient[] = null;
}
