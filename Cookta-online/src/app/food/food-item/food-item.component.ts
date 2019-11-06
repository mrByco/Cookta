import {Component, Input, OnInit} from '@angular/core';
import {Food} from "../../../models/grocery/food.model";

@Component({
  selector: 'app-food-item',
  templateUrl: './food-item.component.html',
  styleUrls: ['./food-item.component.css']
})
export class FoodItemComponent implements OnInit {

  @Input() Food: Food;

  constructor() { }

  ngOnInit() {
  }

}
