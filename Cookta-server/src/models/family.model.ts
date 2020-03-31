import {StoreItemBase} from "atomik/lib/store-item/store-item-base";
import {EFamilyRole, ifamilyMember} from "../interfaces/ifamilyMember";
import {Services} from "../Services";
import {Food} from "./food/food.model";

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

    public ownerSub: string = null;
    public name: string = null;
    public members: ifamilyMember[] = null;


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

    public async GetFamilyFoods(): Promise<Food[]> {
        let foods: Food[] = [];
        for (let member of this.members){
            let user = Services.UserService.FindOne(u => u.sub == member.sub);
            let f = await Food.GetAllOwnFoods(user);
            foods = foods.concat(f);
        }
        return foods;
    }
}
