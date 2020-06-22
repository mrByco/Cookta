import {User} from '../user.model';
import {SendableFood} from './food-sendable';
import {IIngredient} from 'cookta-shared/src/models/ingredient/ingredient.interface';
import {StoreItemBase} from 'atomik/lib/store-item/store-item-base';
import {Tag} from '../tag.model';
import {ObjectID} from 'mongodb';
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

    constructor(id: ObjectID) {
        super(id);
        this.foodId = id.toHexString();
    }

    public get id(): string {
        return this.Id.toHexString();
    }

    /*
        public static FromDocument(doc: any): Food {
            return new Food(
                doc['owner'],
                doc['name'],
                doc['desc'],
                doc['private'],
                doc['published'],
                doc['ingredients'],
                doc['imageUploaded'],
                doc['uploaded'],
                doc['dose'],
                doc['tags'],
                doc['lastModified'],
                doc['generated'],
                doc['subscriptions'],
                typeof (doc['_id']) != 'string' ? (doc['_id'] as ObjectID).toHexString() : doc['_id'], //need to handle either ObjectID and string
                doc['foodId']
            )
        }*/

    /*
        public ToDocument(): any {
            return {
                owner: this.owner,
                name: this.name,
                desc: this.desc,
                private: this.isPrivate,
                published: this.published,
                ingredients: this.ingredients,
                imageUploaded: this.imageUploaded,
                uploaded: this.uploaded,
                dose: this.dose,
                tags: this.tags,
                lastModified: this.lastModified,
                generated: this.generated,
                subscriptions: this.subscriptions,
                _id: new ObjectID(this.id),
                foodId: this.foodId
            }
        }*/
    public async ToSendable(sendFor?: User, cachedSubFoods?: Food[]): Promise<ISendableFood> {
        return await SendableFood.Create(this, sendFor, cachedSubFoods);
    }


}
