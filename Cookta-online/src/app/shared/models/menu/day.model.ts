import {IMeal} from './mealing.interface';
import {EMealType} from './mealtype.enum';

export class Day {
  static PlaceHolder: Day = new Day('0001-01-01', []);

  constructor(public date: string,
              public mealings: IMeal[]) {
  }

  public GetMealsOfMealing(type: EMealType){
    return this.mealings.filter(x => x.mealIndex == type);
  }

}
