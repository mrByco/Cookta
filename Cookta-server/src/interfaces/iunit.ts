enum EUnitType {
    VOLUME,
    COUNT,
    MASS
}
export interface iUnit {
    type: EUnitType,
    name: string,
    shortname: string,
    tobase: number,
    id: string,
}
