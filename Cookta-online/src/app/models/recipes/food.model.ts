import {Ingredient} from './ingredient.model';
import {User} from '../user/user.model';

export class Food {
  public Name: string;
  public Description: string;
  public Ingredients: Ingredient[];
  public ImageUrl: string;
  public Owner: User;
}
