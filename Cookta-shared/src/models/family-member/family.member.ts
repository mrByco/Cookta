export interface ifamilyMember {
    sub: string;
    role: EFamilyRole;
}
export interface SendFamilyMember {
    sub: string;
    role: EFamilyRole;
    username: string;
    profilpic: string;
}

export enum EFamilyRole {
    owner,
    partner,
    child,
    guest
}
