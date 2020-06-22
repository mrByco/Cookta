import {ISendableFood} from "../food/food-sendable.interface";

export interface IHomeRowContent {
    clickAction: string;
    foods: ISendableFood[];
    title: string;
    big?: boolean;
    other: any;
}