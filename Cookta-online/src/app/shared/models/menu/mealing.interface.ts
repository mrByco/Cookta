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

  public static async GetMealFood(meal: Meal, foodService: FoodService): Promise<Food> {
    switch (meal.type) {
      case "food":
        return await foodService.GetFood(meal.foodId);
      case "tag":
        console.log(meal);
        return await foodService.GetFood(meal.foodId);
      case "fixed":
        break;
    }
  }
}

