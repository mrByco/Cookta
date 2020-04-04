import {EMealType} from './mealtype.enum';
import {Food} from '../grocery/food.model';
import {FoodService} from '../../services/food.service';
import {Injectable} from '@angular/core';
import {IIngredient} from '../grocery/ingredient.interface';

export interface IMeal {
  type: string;
  mealIndex: EMealType;
  id: string;
  foodId: string;
  dose: number;
  info?: any;

}

