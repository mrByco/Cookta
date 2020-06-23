import {User} from '../user.model';
import {SendableFood} from './food-sendable';
import {IIngredient} from 'cookta-shared/src/models/ingredient/ingredient.interface';
import {StoreItemBase} from 'atomik/lib/store-item/store-item-base';
import {Tag} from '../tag.model';
import {ISendableFood} from 'cookta-shared/src/models/food/food-sendable.interface';


export class Food extends StoreItemBase {
    public static readonly CollectionName = 'Foods';

    public owner: string = null;
    public name: string = null;
    public desc: string = null;
    public private: boolean = null;
    public published: boolean = null;
    public ingredients: IIngredient[] = null;
    public imageUploaded: number = null;
    public uploaded: number = null;
    public dose: number = null;
    public tags: string[] = null;
    public lastModified: number = null;
    public generated: { tags: Tag[] } = null;
    public subscriptions: number = null;
    public foodId: string = null;

    public get id(): string {
        return this.Id.toHexString();
    }
    public async ToSendable(sendFor?: User, cachedSubFoods?: Food[]): Promise<ISendableFood> {
        return await SendableFood.Create(this, sendFor, cachedSubFoods);
    }


}
