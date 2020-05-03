import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EMealType} from '../../shared/models/menu/mealtype.enum';
import {Day} from '../../shared/models/menu/day.model';
import {DisplayMeal} from '../menu-editor/menu-editor.component';
import {IMeal} from '../../shared/models/menu/mealing.interface';
import {FoodService} from '../../shared/services/food.service';
import {MenuDayComponent} from '../menu-day/menu-day.component';
import {Food} from '../../shared/models/grocery/food.model';
import {Tag} from '../../shared/models/grocery/tag.model';
import {FormBuilder} from '@angular/forms';
import {TagService} from '../../shared/services/tag.service';
import {Router} from "@angular/router";
import { ISendableFood } from '../../../../../Cookta-shared/src/models/food/food-sendable.interface';

@Component({
  selector: 'app-menu-mealing',
  templateUrl: './menu-mealing.component.html',
  styleUrls: ['./menu-mealing.component.css']
})
export class MenuMealingComponent implements OnInit {

  @Input() MealName: string = 'MEALNAME';
  @Input() MealType: EMealType = 0;
  @Input() Day: Day = Day.PlaceHolder;
  @Input() MenuDayComponent: MenuDayComponent = null;
  @Output() AddMealToDay: EventEmitter<IMeal> = new EventEmitter<IMeal>();
  public displayMeals: DisplayMeal[] = [];
  DoseEdit: { displayMeal: DisplayMeal, dose: number } = {displayMeal: undefined, dose: undefined}
  doseForm;

  constructor(public foodService: FoodService, private formBuilder: FormBuilder, public tagService: TagService, public router: Router) {
    this.doseForm = this.formBuilder.group({dose: undefined});
  }

  public async setDay(day: Day): Promise<void> {
    this.Day = day;
    let meals = this.Day.GetMealsOfMealing(this.MealType);
    let newDisplayMeals = [];
    let knownFoods = this.displayMeals.map(m => m.ObjFood).filter(m => m);
    for (let meal of meals) {
      newDisplayMeals.push(new DisplayMeal(this.foodService, meal, knownFoods));
    }
    this.displayMeals = newDisplayMeals;
  }

  ngOnInit() {
    this.MenuDayComponent.OnDayChanged.subscribe(i => this.setDay(i));
  }

  public AddCurrentMealToDay() {
    if (!this.MenuDayComponent.SelectedItem) {
      return;
    }

    let mealToAdd: IMeal;
    if (this.MenuDayComponent.SelectedItem instanceof Food) {
      mealToAdd = {
        dose: 4,
        foodId: this.MenuDayComponent.SelectedItem.foodId,
        id: undefined, mealIndex: this.MealType,
        type: 'food',
        info: {}
      };
    } else if (this.MenuDayComponent.SelectedItem instanceof Tag) {
      mealToAdd = {
        dose: 4,
        foodId: undefined,
        id: undefined, mealIndex: this.MealType,
        type: 'tag',
        info: {tagId: this.MenuDayComponent.SelectedItem.guid}
      };
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
      this.MenuDayComponent.CurrentDay.mealings.findIndex(m => meal.sourceMeal == m)).then(d => {
      this.MenuDayComponent.CurrentDay = d;
      this.MenuDayComponent.OnDayChanged.emit(d);
    });
  }

  FinalizeMeal(meal: DisplayMeal) {
    this.MenuDayComponent.mealingService.FinalizeMealing(this.MenuDayComponent.CurrentDay.date,
      this.MenuDayComponent.CurrentDay.mealings.findIndex(m => meal.sourceMeal == m)).then(d => {
      this.MenuDayComponent.CurrentDay = d;
      this.MenuDayComponent.OnDayChanged.emit(d);
    });
  }


  EditDoseFor(meal: DisplayMeal) {
    if (this.DoseEdit.displayMeal == meal)
      this.DoseEdit.displayMeal = undefined;
    else {
      this.DoseEdit.displayMeal = meal;
      this.DoseEdit.dose = meal.sourceMeal.dose;
    }
  }

  GetFoodUrl(ObjFood: ISendableFood): string {
    return Food.GetImageForFood(ObjFood);
  }

  SetMealDose(data: Event, meal: DisplayMeal) {
    meal.sourceMeal.dose = data['dose'];
    this.DoseEdit.displayMeal = undefined;
    this.MenuDayComponent.SaveDay();
  }

  OpenFoodForMeal(meal: DisplayMeal) {
    if (meal.sourceMeal.type == 'final') {
      this.router.navigate(['/foods', meal.sourceMeal.foodId, this.Day.date, this.Day.mealings.indexOf(meal.sourceMeal)]);
    } else {
      this.router.navigate(['/foods', meal.sourceMeal.foodId]);
    }
  }
}
