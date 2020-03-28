import {ObjectID, ObjectId} from "mongodb";
import {MongoHelper} from "../helpers/mongo.helper";
import {Role} from "./role.model";
import * as jwt from 'jsonwebtoken';
import * as request from "request";
import {Family, SendFamily} from "./family.model";
import {Food} from "./food/food.model";
import {Subscription} from "./subscription.model";
import {StoreItemBase} from "atomik/store-item/store-item-base";
import {IStoreService} from "atomik/store-service/store-service-interface";
import {Services} from "../Services";
import {ExtendedUser} from "./extendedUser";


export class User extends StoreItemBase {
    public sub: string;
    public subs: string[];
    public username: string;
    public role: string;
    public email: string;
    public logs: {time: number, text: string}[];
    public profilpic: string;
    public currentFamilyId: string;

    constructor(_id: ObjectId, connectedService: IStoreService<User>) {
        super(_id, connectedService);
    }

    public HasPermission(permission: string): boolean{
        let role = Role.GetRole(this.role);
        return role.permissions.includes(permission);
    }

    public GetCurrentFamily(): Family{
        let currentFamily = this.currentFamilyId ?
            Services.FamilyService.FindOne(f => f.Id.toHexString() === this.currentFamilyId) : null;
        if (!currentFamily)
            currentFamily = this.FixCurrentFamily();
        return currentFamily;
    }

    private FixCurrentFamily(): Family{
        let familyToSwitch = Services.FamilyService.FindOne(f => f.members.find(m => m.sub == this.sub) != null);
        if (!familyToSwitch)
            familyToSwitch = Services.FamilyService.CreateFamily(this, `${this.username} családja`);
        this.currentFamilyId = familyToSwitch.Id.toHexString();
        Services.UserService.SaveItem(this);
        return familyToSwitch;
    }

    public SwitchCurrentFamily(OtherFamily: Family){
        if (OtherFamily.members.find(m => m.sub == this.sub)){
            this.currentFamilyId = OtherFamily.Id.toHexString();
            Services.UserService.SaveItem(this);
        }
    }


    public async RefreshDependenciesToPrimarySub(): Promise<void>{
        let subs = this.subs;
        let primary = this.sub;

        let foods = await Food.GetAllFoods({});
        for (let sub of subs){
            for (let food of foods.filter(f => f.owner == sub)){
                food.owner = primary;
                await food.Save();
            }

            let subscriptions = await Subscription.GetAll();
            for (let subscription of subscriptions.filter(s => s.userSub == sub)){
                subscription.userSub = primary;
                await subscription.Save()
            }

            let families = Services.FamilyService.GetUserFamilies(this);
            for (let family of families){
                if (family.ownerSub == sub) family.ownerSub = primary;
                for (let member of family.members){
                    if (member.sub == sub){
                        member.sub = primary;
                    }
                }
                await Services.FamilyService.SaveItem(family);
            }
        }
    }

    public async Save(){
        return await Services.UserService.SaveItem(this);
    }

    public ToExtendedUser(): ExtendedUser{
        let activeFamily: SendFamily = this.GetCurrentFamily().ToSendFamily();
        let families: SendFamily[] = Services.FamilyService.GetUserFamilies(this).map(f => f.ToSendFamily());

        return {
            ActiveFamily: activeFamily,
            Families: families,
            currentFamilyId: activeFamily.id,
            email: this.email,
            logs: this.logs,
            profilpic: this.profilpic,
            role: this.role,
            sub: this.sub,
            subs: this.subs,
            username: this.username
        }
    }


}
