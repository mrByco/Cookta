import {Component, Input, OnInit} from '@angular/core';
import {EMealType} from "../../shared/models/menu/mealtype.enum";
import {Day} from "../../shared/models/menu/day.model";
import {DisplayMeal, DisplayMealing} from "../menu-editor/menu-editor.component";
import {Meal} from "../../shared/models/menu/mealing.interface";
import {FoodService} from "../../shared/services/food.service";

@Component({
  selector: 'app-menu-mealing',
  templateUrl: './menu-mealing.component.html',
  styleUrls: ['./menu-mealing.component.css']
})
export class MenuMealingComponent implements OnInit {

  @Input() MealName: string = "MEALNAME";
  @Input() MealType: EMealType = 0;
  @Input() Day: Day = Day.PlaceHolder;

  public async setDay(day: Day, foodService: FoodService): Promise<void>{
    this.Day = day;
    let meals = this.Day.GetMealsOfMealing(this.MealType);
    for (let meal of meals){
      this.displayMeals.push(new DisplayMeal(foodService, meal))
    }
  }

  public displayMeals: DisplayMeal[];

  constructor() { }

  ngOnInit() {

  }

}
