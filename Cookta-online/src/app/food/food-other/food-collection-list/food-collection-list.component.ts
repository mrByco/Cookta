import { Component, OnInit } from '@angular/core';
import {Food} from "../../../shared/models/grocery/food.model";
import {FoodService} from "../../../shared/services/food.service";

@Component({
  selector: 'app-food-collection-list',
  templateUrl: './food-collection-list.component.html',
  styleUrls: ['./food-collection-list.component.scss']
})
export class FoodCollectionListComponent implements OnInit {

  public Foods: Food[];

  constructor(private foodService: FoodService) { }

  ngOnInit() {
    this.foodService.GetCollection().then(foods => {
      this.Foods = foods;
    });
  }
}
