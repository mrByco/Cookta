import { Component, OnInit } from '@angular/core';
import {ISendableFood} from '../../../../../Cookta-shared/src/models/food/food-sendable.interface';
import {FoodService} from '../../shared/services/food.service';
import {Food} from '../../shared/models/grocery/food.model';

@Component({
  selector: 'app-food-feed',
  templateUrl: './food-feed.component.html',
  styleUrls: ['./food-feed.component.css']
})
export class FoodFeedComponent implements OnInit {
  FeedItems: Food[];

  constructor(private foodServie: FoodService) {
    foodServie.GetLastFoods(20).then(foods => this.FeedItems = foods);

  }

  ngOnInit(): void {
  }

  GetFoodImage(food: ISendableFood) {
    return Food.GetImageForFood(food);
  }
}
