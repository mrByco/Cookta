import {IRoute} from "waxen/dist/abstract/route.interface";
import {ERouteMethod} from "waxen/dist/route-method.enum";
import {ControllerData} from "waxen/dist/abstract/controller.interface";
import {ISendFamily} from "../../models/family/family.interface";
import {InviteFamilyRequest} from "./invite.family.request";

const GetFamily: IRoute<void, ISendFamily, {familyId: string}> = {method: ERouteMethod.GET, path: ''}
const SwitchFamily: IRoute<void, ISendFamily, {newId: string}> = {method: ERouteMethod.PUT, path: ''}
const DeleteFamily: IRoute<void, ISendFamily, {deleteId: string}> = {method: ERouteMethod.DELETE, path: ''}
const CreateFamily: IRoute<void, ISendFamily, {name: string}> = {method: ERouteMethod.POST, path: ''}

//TODO Client side invalid
const InviteByUserNameEmail: IRoute<InviteFamilyRequest, ISendFamily, {familyId: string}> = {method: ERouteMethod.GET, path: 'invite'}
//TODO Client side invalid
const LeaveFamily: IRoute<void, ISendFamily, {familyId: string, removeUserSub: string}> = {method: ERouteMethod.DELETE, path: 'leave'}


export const FamilyControllerData: ControllerData = {
    basepath: "family", name: "Families", routes: [GetFamily, SwitchFamily, DeleteFamily, CreateFamily, InviteByUserNameEmail, LeaveFamily]
}
