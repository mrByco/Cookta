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


}
