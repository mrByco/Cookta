import {EFamilyRole, ifamilyMember} from "../interfaces/ifamilyMember";
import {ObjectID} from "mongodb";
import {User} from "./user.model";
import {MongoHelper} from "../helpers/mongo.helper";

export class Family {
    public static readonly CollectionName = "Stock";

    constructor(
        public id: string,
        public ownerSub: string,
        public name: string,
        public members: ifamilyMember[],
    ) {}

    public static async DeleteFamily(user: User, familyId: string): Promise<boolean>{
        let family = await this.GetFamily(user, familyId);
        if (family == null) return false;
        let collection = await MongoHelper.getCollection(this.CollectionName);
        if (family.ownerSub == user.sub){
            await collection.deleteOne({_id: family.id});
            for (let member of family.members){
                let user = await User.GetUser(member.sub);
                await user.ChangeFamily();
            }
        }else {
            return false;
        }
    }

    //Returns family if user able to se the family
    public static async GetFamily(user: User, familyId?: string): Promise<Family>{
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let family: Family;
        if (familyId){
            let doc = await collection.findOne({_id: new ObjectID(familyId)});
            family = this.FromDocument(doc);
        }
        else{
            let families = await this.GetAllFamilies();
            let filtered = families.filter(x => x.ownerSub == user.sub || x.members.find(m => m.sub == user.sub));
            family = filtered.length > 0 ? filtered[0] : await this.CreateFamily(user, `${user.username} családja`);
        }
        if (family.members.find(x => x.sub == user.sub)){
            return family;
        }else{
            return null;
        }
    }

    private static async GetAllFamilies(): Promise<Family[]> {
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let array = await collection.find().toArray();
        let families = [];
        for (let doc of array){
            families.push(this.FromDocument(doc));
        }
        return families;
    }

    //Creates the new family
    public static async CreateFamily(owner: User, familyName): Promise<Family>{
        let family: Family = new Family(new ObjectID().toHexString(), owner.sub, familyName, [{role: EFamilyRole.owner, sub: owner.sub}]);
        let collection = await MongoHelper.getCollection(this.CollectionName);
        await collection.insertOne(family.ToDocument());
        return family;
    }

    private static FromDocument(doc: any): Family {
        return new Family (
            (doc['_id'] as ObjectID).toHexString(),
            doc['ownerSub'],
            doc['name'],
            doc['members']
        );
    }
    private ToDocument(): any {
        return {
            _id: ObjectID.toString(),
            ownerSub: this.ownerSub,
            name: this.name,
            members: this.members,
        }
    }
}
