export interface ifamilyMember {
    sub: string;
    role: EFamilyRole;
}
export enum EFamilyRole {
    owner,
    partner,
    child,
    guest
}
