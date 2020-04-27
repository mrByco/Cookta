
import {StoreItemBase} from "atomik/lib/store-item/store-item-base";
import {IEssentialSection} from "./essential-list.interface";
import {IIngredient} from "cookta-shared/dist/models/ingredient/ingredient.interface";

export class EssentialSection extends StoreItemBase implements IEssentialSection {
    public FamilyId: string = null;
    public Essentials: IIngredient[] = null;
}
