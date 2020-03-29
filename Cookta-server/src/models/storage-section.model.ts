import {StoreItemBase} from "atomik/lib/store-item/store-item-base";
import {ObjectId} from "mongodb";
import {IIngredient} from "../interfaces/IIngredient";
import {IStorageSectionRequest} from "../interfaces/IStorageSectionRequest";
import {Services} from "../Services";

export class StorageSection extends StoreItemBase implements IStorageSectionRequest {

    public FamilyId: string = null;
    public Name: string = null;
    public Items: IIngredient[] = null;
    public GeneralList: IIngredient[] = null;
    public IsDefaultList: boolean = null;



    public async Save(){
        return await Services.StorageService.SaveItem(this);
    }


}

