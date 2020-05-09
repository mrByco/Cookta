import {MongoHelper} from "../helpers/mongo.helper";
import {IRole} from "cookta-shared/src/models/roles/role.interface";

export class Role implements IRole {
    private static readonly CollectionName = 'Roles';
    public static roles;

    constructor (
        public roleID: string,
        public displayName: string,
        public permissions: string[]
    ) {}


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

    public static FromDocument(document: any): Role {
        return new Role(document['roleID'], document['displayName'], document['permissions']);
    }

}
