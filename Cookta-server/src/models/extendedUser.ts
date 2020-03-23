import {SendFamily} from "./family.model";

export interface ExtendedUser {


    sub: string;
    subs: string[];
    username: string;
    role: string;
    email: string;
    logs: {time: number, text: string}[];
    profilpic: string;
    currentFamilyId: string;

    ActiveFamily: SendFamily;
    Families: SendFamily[];

}
