import {ISendableFood} from "cookta-shared/src/models/food/food-sendable.interface";


export interface IMealing {
    type: string,
    mealIndex: number,
    id?: string,
    foodId?: string,
    info?: {finalFood?: ISendableFood, tagId?: string},
    dose?: number;
}
