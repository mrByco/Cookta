import {Food} from '../recipes/food.model';

export interface IMealingItem {
  GetMealingFood(): Food;
}
