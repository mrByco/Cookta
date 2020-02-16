import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EMealType} from "../../shared/models/menu/mealtype.enum";
import {Day} from "../../shared/models/menu/day.model";
import {DisplayMeal, DisplayMealing} from "../menu-editor/menu-editor.component";
import {Meal} from "../../shared/models/menu/mealing.interface";
import {FoodService} from "../../shared/services/food.service";
import {MenuDayComponent} from "../menu-day/menu-day.component";
import {Food} from "../../shared/models/grocery/food.model";

@Component({
  selector: 'app-menu-mealing',
  templateUrl: './menu-mealing.component.html',
  styleUrls: ['./menu-mealing.component.css']
})
export class MenuMealingComponent implements OnInit {

  @Input() MealName: string = "MEALNAME";
  @Input() MealType: EMealType = 0;
  @Input() Day: Day = Day.PlaceHolder;
  @Input() MenuDayComponent: MenuDayComponent = null;
  @Output() AddMealToDay: EventEmitter<Meal> = new EventEmitter<Meal>();

  public async setDay(day: Day): Promise<void>{
    this.Day = day;
    let meals = this.Day.GetMealsOfMealing(this.MealType);
    this.displayMeals = [];
    for (let meal of meals){
      this.displayMeals.push(new DisplayMeal(this.foodService, meal))
    }
  }

  public displayMeals: DisplayMeal[] = [];



  constructor(public foodService: FoodService) { }

  ngOnInit() {
    this.MenuDayComponent.OnDayChanged.subscribe(i => this.setDay(i));
  }

  public AddCurrentMealToDay() {
    if (!this.MenuDayComponent.SelectedItem)
      return null;

    let mealToAdd = new Meal( (this.MenuDayComponent.SelectedItem instanceof Food ? 'food' : ''), this.MealType, this.MenuDayComponent.SelectedItem.id, this.MenuDayComponent.SelectedItem.foodId, this.MenuDayComponent.SelectedItem.info);
    this.AddMealToDay.emit(mealToAdd);
    console.log(mealToAdd);
  }

  public DeleteMeal(meal: DisplayMeal) {
    this.MenuDayComponent.CurrentDay.mealings.splice(this.MenuDayComponent.CurrentDay.mealings.findIndex(d => d == meal.sourceMeal), 1);
    this.MenuDayComponent.SaveDay();
    this.MenuDayComponent.OnDayChanged.emit(this.MenuDayComponent.CurrentDay);
  }
}
