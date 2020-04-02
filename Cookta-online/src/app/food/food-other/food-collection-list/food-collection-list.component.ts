import { Component, OnInit } from '@angular/core';
import {Food} from "../../../shared/models/grocery/food.model";
import {FoodService} from "../../../shared/services/food.service";

@Component({
  selector: 'app-food-collection-list',
  templateUrl: './food-collection-list.component.html',
  styleUrls: ['./food-collection-list.component.scss']
})
export class FoodCollectionListComponent implements OnInit {

  public OwnFoods: Food[];
  public SubFoods: Food[];
  public FamilyFoods: Food[];

  constructor(private foodService: FoodService) { }

  ngOnInit() {
    this.foodService.GetOwnFoods().then(foods => {
      this.OwnFoods = foods;
    });
    this.foodService.GetFamilyFoods().then(foods => {
      this.FamilyFoods = foods;
    });
    this.foodService.GetSubscriptionFoods().then(foods => {
      this.SubFoods = foods;
    });
  }
}
