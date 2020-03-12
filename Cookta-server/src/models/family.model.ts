import {EFamilyRole, ifamilyMember} from "../interfaces/ifamilyMember";
import {ObjectID} from "mongodb";
import {User} from "./user.model";
import {MongoHelper} from "../helpers/mongo.helper";

export interface SendFamilyMember {
    sub: string,
    role: EFamilyRole,
    username: string,
    profilpic: string,
}

export interface SendFamily {
    id: string,
    name: string,
    members: SendFamilyMember[],
}
export class Family {
    public static readonly CollectionName = "Family";

    constructor(
        public id: string,
        public ownerSub: string,
        public name: string,
        public members: ifamilyMember[],
    ) {}

    public async JoinUserToFamily(inviter: User, invited: User): Promise<boolean>{
        if (
            (this.ownerSub == inviter.sub || this.members.find(m => m.sub == inviter.sub && m.role == EFamilyRole.owner))
            && !this.members.find(m => m.sub == invited.sub)){
            this.members.push({sub: invited.sub, role: EFamilyRole.guest});
            await this.Save();
            return true;
        }
        else return false;
    }

    public async KickUserFromFamily(user: User, userToLeave: User): Promise<boolean>{
        if (this.ownerSub == userToLeave.sub || !this.members.find(m => m.sub == userToLeave.sub))
            return false;

        if (user.sub == userToLeave.sub){
            this.members.splice(this.members.findIndex(u => u.sub == userToLeave.sub));
            await this.Save();
            return true;
        }else if (this.ownerSub == user.sub || this.members.find(m => m.sub == user.sub && m.role == EFamilyRole.owner)){
            this.members.splice(this.members.findIndex(u => u.sub == userToLeave.sub));
            await this.Save();
            return true;
        }else{
            return false;
        }
    }

    public static async DeleteFamily(user: User, familyId: string): Promise<boolean>{
        let family = await this.GetFamily(user, familyId);
        if (family == null) return false;
        let collection = await MongoHelper.getCollection(this.CollectionName);
        if (family.ownerSub == user.sub){
            await collection.deleteOne({_id: new ObjectID(family.id)});
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
        let doc = familyId ? await collection.findOne({_id: new ObjectID(familyId)}) : null;
        if (doc){
            family = this.FromDocument(doc);
        }
        else{
            let pool = await this.GetUserFamilies(user);
            family = pool.length > 0 ? pool[0] : await this.CreateFamily(user, `${user.username} családja`);
            return await user.ChangeFamily(family.id);

        }
        if (family.members.find(x => x.sub == user.sub)){
            return family;
        }else{
            return await user.ChangeFamily();
        }
    }


    public static async GetUserFamilies(user: User){
        let families = await this.GetAllFamilies();
        return families.filter(x => x.members.find(m => m.sub == user.sub));
    }

    private static async    GetAllFamilies(): Promise<Family[]> {
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
        let family: Family = new Family(new ObjectID().toString(), owner.sub, familyName, [{role: EFamilyRole.owner, sub: owner.sub}]);
        await family.Save();
        return family;
    }

    private async Save(){
        let collection = await MongoHelper.getCollection(Family.CollectionName);
        await collection.replaceOne({_id: new ObjectID(this.id)}, this.ToDocument(), {upsert: true});
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
            _id: new ObjectID(this.id),
            ownerSub: this.ownerSub,
            name: this.name,
            members: this.members,
        }
    }

    public async ToSendFamily(user: User): Promise<SendFamily>{
        let members: SendFamilyMember[] = [];
        for (let member of this.members){
            let user = await User.GetUser(member.sub);
            members.push({role: member.role, sub: member.sub, username: user.username, profilpic: user.profilpic})
        }
        return {name: this.name, members: members, id: this.id}
    }
}
