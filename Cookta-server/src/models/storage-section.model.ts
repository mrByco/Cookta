import {StoreItemBase} from "atomik/store-item/store-item-base";
import { ObjectId } from "mongodb";
import { IStoreService } from "atomik/store-service/store-service-interface";
import {IIngredient} from "../interfaces/IIngredient";

export class StorageSection extends StoreItemBase {

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
