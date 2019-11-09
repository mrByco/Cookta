import {Food} from "./food.model";
import {iIngredient} from "../../interfaces/iingredient";
import {ObjectID} from "bson";

export class PersonalFood {

    public owner: string;
    public name: string = "";
    public desc: string = "";
    public isPrivate: boolean = true;
    public published: boolean = false; //TODO Replace by checking new certificate system DEP: new certificate system + blockchain food store
    public ingredients: iIngredient[] = [];
    public imageUploaded: number;
    public uploaded: number;
    public dose: number = 4;
    public tags: string[] = [];
    public lastModified: number;
    public generated: any = {};
    public subscriptions: number;
    public id: string = new ObjectID().toHexString();
    public foodId: string;

    constructor(food: Food) {
        // noinspection
        this.owner = food.owner;
        this.name = food.name;
        this.desc = food.desc;
        this.isPrivate = food.isPrivate;
        this.published = food.published;
        this.ingredients = food.ingredients;
        this.imageUploaded = food.imageUploaded;
        this.uploaded = food.uploaded;
        this.dose = food.dose;
        this.tags = food.tags;
        this.lastModified = food.lastModified;
        this.generated = food.generated;
        this.subscriptions = food.subscriptions;
        this.id = food.id;
        this.foodId = food.foodId;
    }
}
