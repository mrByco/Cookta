import { IIngredient } from './ingredient.interface';

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
    public tags: string[] = [],
    public lastModified: number,
    public generated: any = {},
    public subscriptions: number,
    public id: string,
    public foodId: string
  ) {}



}
