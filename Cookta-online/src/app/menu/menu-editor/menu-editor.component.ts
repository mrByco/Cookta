import {Component, EventEmitter, OnInit} from '@angular/core';
import {CdkDropList} from '@angular/cdk/drag-drop';
import {FoodService} from '../../shared/services/food.service';
import {Day} from '../../shared/models/menu/day.model';
import {IMeal} from '../../shared/models/menu/mealing.interface';
import {EMealType} from '../../shared/models/menu/mealtype.enum';
import {ISendableFood} from '../../shared/models/grocery/food.isendable.interface';

export class DisplayMeal {
  public ObjFood: ISendableFood = FoodService.Placeholder;
  public Refreshing: boolean = false;

  constructor(public foodService: FoodService,
              public sourceMeal: IMeal,
              knownFoods?: ISendableFood[]) {
    if (!sourceMeal.foodId) {
      this.ObjFood = null;
      return;
    }
    let foodId = sourceMeal.foodId;
    if (sourceMeal.type == 'final') {
      this.ObjFood = sourceMeal.info.finalFood as ISendableFood;
    } else if (knownFoods && knownFoods.find(f => f.foodId == foodId)) {
      this.ObjFood = knownFoods.find(f => f.foodId == foodId);
    } else {
      foodService.GetFood(foodId).then(f => this.ObjFood = f ? f : FoodService.NoReferenceError);
    }
  }
}

export class DisplayMealing {

  public Meals: DisplayMeal[] = [];
  public Time: EMealType;
  public Day: Day;

  constructor(time: EMealType, day: Day, foodService: FoodService) {
    let filtered = day.GetMealsOfMealing(time);
    for (let meal of filtered) {
      this.Meals.push(new DisplayMeal(foodService, meal));
    }
  }

}

@Component({
  selector: 'app-menu-editor',
  templateUrl: './menu-editor.component.html',
  styleUrls: ['./menu-editor.component.css']
})
export class MenuEditorComponent {

  public Selected: any;

  public day: Day = new Day('2001-01-01', []);
  public currentDate: string = '2001-02-01';

  public mealings: { container: CdkDropList, mealing: DisplayMealing }[];

  public OnSelectedChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor(public foodService: FoodService) {
    this.OnSelectedChanged.subscribe(i => this.Selected = i);
  }

  public SelectItem(item: any) {
    this.Selected = item;
    this.OnSelectedChanged.emit(item);
  }
}
