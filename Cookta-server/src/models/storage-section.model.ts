import {StoreItemBase} from "atomik/store-item/store-item-base";
import { ObjectId } from "mongodb";
import { IStoreService } from "atomik/store-service/store-service-interface";
import {IIngredient} from "../interfaces/IIngredient";
import {IStorageSection} from "../interfaces/IStorageSection";

export class StorageSection extends StoreItemBase implements IStorageSection {

    public Id: ObjectId;
    public FamilyId: string;
    public Name: string;
    public Items: IIngredient[];
    public GeneralList: IIngredient[];
    public IsDefaultList: boolean;

    constructor(
        _id: ObjectId,
        connectedService: IStoreService)
    {
        super(_id, connectedService);
    }


}

