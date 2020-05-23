import {Food} from "./food.model";
import {ObjectID} from "bson";
import {Tag} from "../tag.model";
import {User} from "../user.model";
import {Subscription} from "../subscription.model";
import {ISendableFood} from "cookta-shared/src/models/food/food-sendable.interface";
import {IIngredient} from "cookta-shared/src/models/ingredient/ingredient.interface";

export class SendableFood implements ISendableFood {

    public owner: string;
    public name: string = "";
    public desc: string = "";
    public published: boolean = false; //TODO Replace by checking new certificate system DEP: new certificate system + blockchain food store
    public private?: boolean;
    public ingredients: IIngredient[] = [];
    public imageUploaded: number;
    public uploaded: number;
    public dose: number = 4;
    public lastModified: number;
    public subscriptions: number;
    public id: string = new ObjectID().toHexString();
    public foodId: string;
    public SubscribedFor: boolean;
    public OwnFood: boolean;



    constructor(food: Food, public tags: Tag[], public autoTags: Tag[], subscribedFor: boolean, ownFood: boolean) {
        // noinspection
        this.owner = food.owner;
        this.name = food.name;
        this.desc = food.desc;
        this.published = food.published;
        this.private = ownFood ? food.private : undefined;
        this.ingredients = food.ingredients;
        this.imageUploaded = food.imageUploaded;
        this.uploaded = food.uploaded;
        this.dose = food.dose;
        this.lastModified = food.lastModified;
        this.subscriptions = food.subscriptions;
        this.id = food.id;
        this.foodId = food.foodId;
        this.SubscribedFor = subscribedFor;
        this.OwnFood = ownFood;
    }

    public static async Create(food: Food, user?: User, subscriptionsOfUser?: Food[]) {
        let autoTags: Tag[] = [];
        let tags: Tag[] = [];

        for (let tag of food.generated?.tags ? food.generated.tags : []) {
            autoTags.push(await Tag.GetTagById(tag.guid));
        }
        for (let tag of food.tags) {
            tags.push(await Tag.GetTagById(tag));
        }

        let ownFood: boolean = false;
        let subscribedFor: boolean = false;

        if (user) {
            subscribedFor = subscriptionsOfUser ?
                subscriptionsOfUser.filter(s => s.id == food.id).length > 0 :
                await Subscription.GetSubscription(user.sub, food.id) != null;
            ownFood =  food.owner == user.sub || user.subs.includes(food.owner)
        }

        return new SendableFood(food, tags, autoTags, subscribedFor, ownFood);
    }

    public static async ToSendableAll(foods: Food[], sendFor?: User) {
        let send = [];
        let subFoods = sendFor ? await Subscription.GetSubsFoodsOfUser(sendFor.sub) : undefined;
        for (let food of foods) {
            send.push(await food.ToSendable(sendFor, subFoods));
        }
        return send;
    }
}
