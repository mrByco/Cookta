import {MongoHelper} from "../helpers/mongo.helper";
import {IRole} from "cookta-shared/src/models/roles/role.interface";
import {StoreItemBase} from "atomik/lib/store-item/store-item-base";

export class Role extends StoreItemBase implements IRole {
    public roleID: string = null;
    public displayName: string = null;
    public permissions: string[] = null;
}
