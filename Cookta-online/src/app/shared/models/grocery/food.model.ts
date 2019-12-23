import { IIngredient } from './ingredient.interface';
import {ITag} from "./tag.interface";

export class Food {

  public get ImageUrl(): string{
    if (!this.imageUploaded) { return null; }
    return `https://kuktaimages.blob.core.windows.net/foodimages/${this.id}.jpg`;
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
    public dose: number = 4,
    public lastModified: number,
    public subscriptions: number,
    public id: string,
    public foodId: string,
    public tags: ITag[],
    public autoTags: ITag[],
  ) {}


  public static FromJson(data: any): Food
  {
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
      data['autoTags']
    )
  }
  public ToJson()
  {
    return new Error('NOT IMPLEMENTED');
  }



}
