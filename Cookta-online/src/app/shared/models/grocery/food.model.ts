import {IIngredient} from './ingredient.interface';
import {Tag} from './tag.model';
import {ISendableFood} from './food.isendable.interface';

export class Food implements ISendableFood{

  public get ImageUrl(): string {
    return Food.GetImageForFood(this);
  }

  constructor(
    public owner: string,
    public name: string = '',
    public desc: string = '',
    public isPrivate: boolean = true,
    public published: boolean = false,
    public ingredients: IIngredient[] = [],
    public imageUploaded: number,
    public uploaded: number,
    public dose: number,
    public lastModified: number,
    public subscriptions: number,
    public id: string,
    public foodId: string,
    public tags: Tag[],
    public autoTags: Tag[],
    public SubscribedFor: boolean,
    public OwnFood: boolean
  ) {
  }


  public static FromJson(data: any): Food {
    return new Food(
      data['owner'],
      data['name'],
      data['desc'],
      data['isPrivate'],
      data['published'],
      data['ingredients'],
      data['imageUploaded'],
      data['uploaded'],
      data['dose'],
      data['lastModified'],
      data['subscriptions'],
      data['id'],
      data['foodId'],
      data['tags'],
      data['autoTags'],
      data['SubscribedFor'],
      data['OwnFood']
    );
  }

  public ToJson() {
    return {
      owner: this.owner,
      name: this.name,
      desc: this.desc,
      isPrivate: this.isPrivate,
      ingredients: this.ingredients,
      imageUploaded: this.imageUploaded, //Because describes the last modification
      dose: this.dose,
      subscriptions: this.subscriptions,
      id: this.id,
      foodId: this.foodId,
      tags: this.tags,
      autoTags: this.autoTags

    };
  }

  public ToISendable(): ISendableFood {
    return {
      owner: this.owner,
      name: this.name,
      desc: this.desc,
      published: this.published,
      ingredients: this.ingredients,
      imageUploaded: this.imageUploaded,
      uploaded: this.uploaded,
      dose: this.dose,
      lastModified: this.lastModified,
      subscriptions: this.subscriptions,
      id: this.id,
      foodId: this.foodId,
      SubscribedFor: this.SubscribedFor,
      OwnFood: this.OwnFood
    };
  }

  public static GetImageForFood(food: ISendableFood): string {
    if (!food || !food.imageUploaded) {
      return 'https://kuktaimages.blob.core.windows.net/application/dish.png';
    }
    return `https://kuktaimages.blob.core.windows.net/foodimages/${food.id}.jpg`;
  }
}
