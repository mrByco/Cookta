import {Meal} from './mealing.interface';
import {EMealType} from './mealtype.enum';

export class Day {

  constructor(public date: string,
              public mealings: Meal[]) {
  }

  public GetMealsOfMealing(type: EMealType){
    return this.mealings.filter(x => x.mealIndex == type);
  }

}
