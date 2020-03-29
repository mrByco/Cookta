import {IIngredient} from "../../interfaces/IIngredient";
import {ObjectID} from "bson";

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
    id: string;
    foodId: string;
    SubscribedFor: boolean;
    OwnFood: boolean;
}
