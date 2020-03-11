import {Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Food} from '../../shared/models/grocery/food.model';
import {FoodService} from '../../shared/services/food.service';
import {Day} from '../../shared/models/menu/day.model';
import {Meal} from '../../shared/models/menu/mealing.interface';
import {EMealType} from '../../shared/models/menu/mealtype.enum';

export class DisplayMeal extends Meal {
  public Food: Food = FoodService.Placeholder;
  public Refreshing: boolean = false;

  constructor(public foodService: FoodService, public sourceMeal: Meal, knownFoods?: Food[]) {
    super(sourceMeal.type, sourceMeal.mealIndex, sourceMeal.id, sourceMeal.foodId, sourceMeal.info);
    if (!sourceMeal.foodId) return;
    let foodId = Meal.GetMealFoodId(this);
    if (sourceMeal.type == 'final'){
      this.Food = sourceMeal.info.finalFood as Food;
      return;
    }

    if (knownFoods && knownFoods.find(f => f.foodId == foodId)){
      this.Food = knownFoods.find(f => f.foodId == foodId);
    } else {
      foodService.GetFood(foodId).then(f => this.Food = f ? f : FoodService.NoReferenceError);
    }
  }
}

export class DisplayMealing {

  public Meals: DisplayMeal[] = [];
  public Time: EMealType;
  public Day: Day;

  constructor(time: EMealType, day: Day, foodService: FoodService) {
    let filtered = day.GetMealsOfMealing(time);
    for (let meal of filtered){
      this.Meals.push(new DisplayMeal(foodService, meal));
    }
  }
  public ToMeals(): Meal[] {
    //TODO Placeholder
    return [];
  }
}

@Component({
  selector: 'app-menu-editor',
  templateUrl: './menu-editor.component.html',
  styleUrls: ['./menu-editor.component.css']
})
export class MenuEditorComponent implements OnInit {

  public Selected: any;

  public day: Day = new Day('2001-01-01', [], null);
  public currentDate: string = '2001-02-01';

  public mealings: {container: CdkDropList, mealing: DisplayMealing}[];

  public OnSelectedChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor(public foodService: FoodService) {
    this.OnSelectedChanged.subscribe(i => this.Selected = i);
  }

  ngOnInit() {
  }

  public SelectItem(item: any){
    this.Selected = item;
    this.OnSelectedChanged.emit(item);
  }
}
