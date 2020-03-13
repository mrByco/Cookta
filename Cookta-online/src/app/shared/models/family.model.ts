export enum EFamilyRole {
  owner,
  partner,
  child,
  guest

}

export interface IFamilyMember {
  sub: string,
  role: EFamilyRole,
  username: string,
  profilpic: string
}
export class Family {
  constructor(public id: string, public name: string, public members: IFamilyMember[]) {
  }


  public static FamilyRoleToString(role: EFamilyRole): string{
    switch (role) {
      case EFamilyRole.child:
        return "Gyerek";
      case EFamilyRole.guest:
        return "Vendég";
      case EFamilyRole.owner:
        return "Házigazda";
      case EFamilyRole.partner:
        return "Partner";

    }
  }
}
