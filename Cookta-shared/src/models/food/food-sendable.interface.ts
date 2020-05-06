import {IIngredient} from "../ingredient/ingredient.interface";
import {ITag} from "../tag/tag.interface";


export interface ISendableFood {

    owner: string;
    name: string;
    desc: string;
    published: boolean;
    ingredients: IIngredient[];
    imageUploaded: number;
    uploaded: number;
    dose: number;
    lastModified: number;
    subscriptions: number;
    tags: ITag[];
    autoTags: ITag[];
    id: string;
    foodId: string;
    SubscribedFor: boolean;
    OwnFood: boolean;
}
