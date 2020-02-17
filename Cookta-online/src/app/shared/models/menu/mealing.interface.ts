import {EMealType} from './mealtype.enum';
import {Food} from '../grocery/food.model';
import {FoodService} from '../../services/food.service';
import {Injectable} from '@angular/core';

export class Meal {
  constructor(
    public type: string,
    public mealIndex: EMealType,
    public id: string,
    public foodId: string,
    public info?: any) {
  }

  public static GetMealFoodId(meal: Meal): string {
    switch (meal.type) {
      case "food":
        return meal.foodId;
      case "tag":
        console.log(meal);
        return meal.foodId;
      case "fixed":
        break;
    }
  }
}

