import {ISendFamily} from "../family/family.interface";

export interface ExtendedUser {
    sub: string;
    subs: string[];
    username: string;
    role: string;
    email: string;
    logs: {time: number, text: string}[];
    profilpic: string;
    currentFamilyId: string;

    ActiveFamily: ISendFamily;
    Families: ISendFamily[];

}
