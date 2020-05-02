import {SendFamilyMember} from "../family-member/family.member";


export interface ISendFamily {
    id: string;
    name: string;
    members: SendFamilyMember[];
}
