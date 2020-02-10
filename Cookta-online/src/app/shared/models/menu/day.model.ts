import {Meal} from './mealing.interface';
import {EMealType} from './mealtype.enum';

export class Day {
  static PlaceHolder: Day = new Day('0001-01-01', [], undefined)

  constructor(public date: string,
              public mealings: Meal[],
              public familyId: string) {
  }

  public GetMealsOfMealing(type: EMealType){
    return this.mealings.filter(x => x.mealIndex == type);
  }

}
