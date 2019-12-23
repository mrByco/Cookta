import { Component, OnInit } from '@angular/core';
import {Food} from "../../shared/models/grocery/food.model";
import {FoodService} from "../../shared/services/food.service";

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss']
})
export class FoodListComponent implements OnInit {

  public Foods: Food[];

  constructor(private foodService: FoodService) { }

  ngOnInit() {
    console.log("Getting foods....")
    this.foodService.GetFoods().then(foods => {
      this.Foods = foods;
      console.log(`${foods.length} foods captured.`);
    });
  }

}
