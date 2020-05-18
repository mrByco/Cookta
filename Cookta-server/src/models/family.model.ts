import {StoreItemBase} from "atomik/lib/store-item/store-item-base";
import {Services} from "../Services";
import {Food} from "./food/food.model";
import {ISendFamily} from "cookta-shared/src/models/family/family.interface";
import { ifamilyMember, SendFamilyMember } from 'cookta-shared/src/models/family-member/family.member';


export class Family extends StoreItemBase {

    public ownerSub: string = null;
    public name: string = null;
    public members: ifamilyMember[] = null;


    public ToSendFamily(): ISendFamily {
        let members: SendFamilyMember[] = [];
        for (let member of this.members) {
            let user = Services.UserService.FindOne(u => u.sub == member.sub);
            if (user)
                members.push({profilpic: user.profilpic, role: member.role, sub: user.sub, username: user.username})
            else{
                //TODO Check family has valid owner and delete if not., delete invalid members
            }
        }

        let sendFamily: ISendFamily = {id: this.Id.toHexString(), members: members, name: this.name}
        return sendFamily;
    }


    public async Save(){
        return await Services.FamilyService.SaveItem(this);
    }

    public async GetFamilyFoods(): Promise<Food[]> {
        let foods: Food[] = [];
        for (let member of this.members){
            let user = Services.UserService.FindOne(u => u.sub == member.sub);
            let f = await Services.FoodService.GetAllOwnFoods(user.sub);
            foods = foods.concat(f);
        }
        return foods;
    }
}
