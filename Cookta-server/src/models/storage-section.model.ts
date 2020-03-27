import {StoreItemBase} from "atomik/store-item/store-item-base";
import { ObjectId } from "mongodb";
import { IStoreService } from "atomik/store-service/store-service-interface";
import {IIngredient} from "../interfaces/IIngredient";
import {IStorageSectionRequest} from "../interfaces/IStorageSectionRequest";
import {Services} from "../Services";

export class StorageSection extends StoreItemBase implements IStorageSectionRequest {

    public Id: ObjectId;
    public FamilyId: string;
    public Name: string;
    public Items: IIngredient[];
    public GeneralList: IIngredient[];
    public IsDefaultList: boolean;

    constructor(
        _id: ObjectId,
        connectedService: IStoreService<any>)
    {
        super(_id, connectedService);
    }


    public async Save(){
        return await Services.StorageService.SaveItem(this);
    }


}

