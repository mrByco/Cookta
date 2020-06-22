import {Component, Input, OnInit} from '@angular/core';
import {IHomeRowContent} from "../../../../../Cookta-shared/src/models/home/home-row-content.interface";
import {ISendableFood} from "../../../../../Cookta-shared/src/models/food/food-sendable.interface";
import {Food} from "../../shared/models/grocery/food.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-row-home-content',
  templateUrl: './row-home-content.component.html',
  styleUrls: ['./row-home-content.component.css']
})
export class RowHomeContentComponent implements OnInit {

  @Input("Content") public Content: IHomeRowContent;

  constructor(public router: Router) {

  }

  ngOnInit(): void {

  }

  public GetFoodImage(food: ISendableFood){
    return Food.GetImageForFood(food);
  }

  FoodClick(food: ISendableFood) {
    console.log("nav" + food)
    this.router.navigate(["foods", food.foodId])
  }
}
