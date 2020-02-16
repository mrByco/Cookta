import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {Food} from '../../../shared/models/grocery/food.model';
import {FoodService} from '../../../shared/services/food.service';

@Component({
  selector: 'app-food-pool',
  templateUrl: './food-pool.component.html',
  styleUrls: ['./food-pool.component.css']
})
export class FoodPoolComponent implements OnInit {

  public Foods: Food[];
  public Selected: Food;

  @Input() public SelectItemOut: (item: any) => void = this.SelectItem;
  @Input() public OnSelectionChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor(public foodService: FoodService) {
    foodService.GetCollection().then(foods => this.Foods = foods);
  }

  ngOnInit() {
    this.OnSelectionChanged.subscribe(i => this.Selected = i);
  }

  GetItemSelected(item: Food): boolean {
    return this.Selected === item;
  }

  SelectItem(item: Food): void {
    if (this.GetItemSelected(item))
      this.OnSelectionChanged.emit(null);
    else
      this.OnSelectionChanged.emit(item);
  }
}
