import {StoreItemBase} from "atomik/store-item/store-item-base";
import {EFamilyRole, ifamilyMember} from "../interfaces/ifamilyMember";
import {Services} from "../Services";

export interface SendFamilyMember {
    sub: string;
    role: EFamilyRole;
    username: string;
    profilpic: string;
}

export interface SendFamily {
    id: string;
    name: string;
    members: SendFamilyMember[];
}

export class Family extends StoreItemBase {

    public ownerSub: string;
    public name: string;
    public members: ifamilyMember[];


    public ToSendFamily(): SendFamily {
        let members: SendFamilyMember[] = [];
        for (let member of this.members) {
            let user = Services.UserService.FindOne(u => u.sub == member.sub);
            if (user)
                members.push({profilpic: user.profilpic, role: member.role, sub: user.sub, username: user.username})
            else{
                //TODO Check family has valid owner and delete if not., delete invalid members
            }
        }

        let sendFamily: SendFamily = {id: this.Id.toHexString(), members: members, name: this.name}
        return sendFamily;
    }


    public async Save(){
        return await Services.FamilyService.SaveItem(this);
    }
}
