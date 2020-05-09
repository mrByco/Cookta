import {MongoHelper} from "../helpers/mongo.helper";
import {IRole} from "cookta-shared/src/models/roles/role.interface";
import {StoreItemBase} from "atomik/lib/store-item/store-item-base";

export class Role extends StoreItemBase implements IRole {
    private static readonly CollectionName = 'Roles';
    public static roles;


    public roleID: string;
    public displayName: string;
    public permissions: string[];



    public static GetRole(roleId: string): Role{
        return this.roles.find(x => x.roleID == roleId);

    }
    public static async init(){
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let array = await collection.find({}).toArray();
        this.roles = [];
        for (let element of array){
            this.roles.push(this.FromDocument(element));
        }
    }

    public ToDocument(role: Role): any{
        return {
            roleID: role.roleID,
            displayName: role.displayName,
            permissions: role.permissions,
        }
    }


}
