import {User} from "./user.model";
import {EFamilyRole} from "../interfaces/ifamilyMember";
import {Family} from "./family.model";
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

export class ExtendedUser extends User {

    constructor(base: User, public sendFamily: SendFamily) {
        super(base._id, base.sub, base.subs, base.username, base.role, base.email, base.logs, base.families, base.profilpic, base.currentFamilyId);
    }
    public static async FromUser(user: User): Promise<ExtendedUser>{
        let family = await Family.GetFamily(user, user.currentFamilyId);
        let members: SendFamilyMember[] = [];
        for (let member of family.members){
            let user = await User.GetUser(member.sub);

            members.push({role: member.role, sub: member.sub, username: user.username, profilpic: user.profilpic})
        }

        return new ExtendedUser(user, {id: family.id, members: members, name: family.name})
    }
}
