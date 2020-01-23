import {User} from "./user.model";
import {Family, SendFamily} from "./family.model";

export class ExtendedUser extends User {

    constructor(base: User, public ActiveFamily: SendFamily, public Families: SendFamily[]) {
        super(base._id, base.sub, base.subs, base.username, base.role, base.email, base.logs, base.profilpic, base.currentFamilyId);
    }
    public static async FromUser(user: User): Promise<ExtendedUser>{

        let activeFamily: SendFamily = await (await Family.GetFamily(user, user.currentFamilyId)).ToSendFamily(user);
        let families: SendFamily[] = [];
        let source: Family[] = await Family.GetUserFamilies(user);
        for (let base of source){
            families.push(await base.ToSendFamily(user))
        }

        return new ExtendedUser(user, activeFamily, families);
    }

}
