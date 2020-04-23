import {IDisplayable} from "../../utilities/displayable";

export interface IPoolItem extends IDisplayable {
    subtitle: string,
    picture?: string,
    original: any,
}
