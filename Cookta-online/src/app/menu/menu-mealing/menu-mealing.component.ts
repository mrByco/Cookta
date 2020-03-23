import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EMealType} from "../../shared/models/menu/mealtype.enum";
import {Day} from "../../shared/models/menu/day.model";
import {DisplayMeal, DisplayMealing} from "../menu-editor/menu-editor.component";
import {Meal} from "../../shared/models/menu/mealing.interface";
import {FoodService} from "../../shared/services/food.service";
import {MenuDayComponent} from "../menu-day/menu-day.component";
import {Food} from "../../shared/models/grocery/food.model";
import {Tag} from "../../shared/models/grocery/tag.model";
import {TagService} from "../../shared/services/tag.service";

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
    let newDisplayMeals = [];
    let knownFoods = this.displayMeals.map(m => m.Food);
    for (let meal of meals){
      newDisplayMeals.push(new DisplayMeal(this.foodService, meal, knownFoods));
    }
    this.displayMeals = newDisplayMeals;
  }

  public displayMeals: DisplayMeal[] = [];



  constructor(public foodService: FoodService, public tagService: TagService) { }

  ngOnInit() {
    this.MenuDayComponent.OnDayChanged.subscribe(i => this.setDay(i));
  }

  public AddCurrentMealToDay() {
    if (!this.MenuDayComponent.SelectedItem) {
      return null;
    }

    let mealToAdd;
      if (this.MenuDayComponent.SelectedItem instanceof Food)
    {
      mealToAdd = new Meal( 'food', this.MealType, undefined, this.MenuDayComponent.SelectedItem.foodId, {});
    }
    else if (this.MenuDayComponent.SelectedItem instanceof Tag)
    {
      mealToAdd = new Meal('tag', this.MealType, undefined, undefined, {tagId: this.MenuDayComponent.SelectedItem.guid})
    }
    this.AddMealToDay.emit(mealToAdd);
  }

  public DeleteMeal(meal: DisplayMeal) {
    this.MenuDayComponent.CurrentDay.mealings.splice(this.MenuDayComponent.CurrentDay.mealings.findIndex(d => d == meal.sourceMeal), 1);
    this.MenuDayComponent.SaveDay();
    this.MenuDayComponent.OnDayChanged.emit(this.MenuDayComponent.CurrentDay);
  }

  RefreshMeal(meal: DisplayMeal) {
    meal.Refreshing = true;
    this.MenuDayComponent.mealingService.RefreshMealing(this.MenuDayComponent.CurrentDay.date,
      this.MenuDayComponent.CurrentDay.mealings.findIndex(m => meal.sourceMeal == m)).then(d => {this.MenuDayComponent.CurrentDay = d; this.MenuDayComponent.OnDayChanged.emit(d)});
  }

  FinalizeMeal(meal: DisplayMeal) {
    this.MenuDayComponent.mealingService.FinalizeMealing(this.MenuDayComponent.CurrentDay.date,
      this.MenuDayComponent.CurrentDay.mealings.findIndex(m => meal.sourceMeal == m)).then(d => {this.MenuDayComponent.CurrentDay = d; this.MenuDayComponent.OnDayChanged.emit(d)});
  }
}
