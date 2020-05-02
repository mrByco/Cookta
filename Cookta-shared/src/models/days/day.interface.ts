import {IMealing} from "./mealing.interface";

export interface IDay {
    date: string,
    mealings: IMealing[],
    familyId: string
}
