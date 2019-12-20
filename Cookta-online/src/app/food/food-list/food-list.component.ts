import { Component, OnInit } from '@angular/core';
import {Food} from "../../../models/grocery/food.model";

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss']
})
export class FoodListComponent implements OnInit {

  public Foods: Food[] = [
    new Food("somebody", "lkjlkjlskajd klasjd laksjd laks skld al", "Leírás", true, false, [], 15, 15, 4, [], 15, {}, 4, "5d40512e38f50600353e1588", "5d40512e38f50600353e1588"),
    new Food("somebody", "lkjlkjlskajd klasjd laksjd laks skld al", "Leírás", true, false, [], 15, 15, 4, [], 15, {}, 4, "5d40512e38f50600353e1588", "5d40512e38f50600353e1588"),
    new Food("somebody", "lkjlkjlskajd klasjd laksjd laks skld al", "Leírás", true, false, [], 15, 15, 4, [], 15, {}, 4, "5d40512e38f50600353e1588", "5d40512e38f50600353e1588"),
    new Food("somebody", "lkjlkjlskajd klasjd laksjd laks skld al", "Leírás", true, false, [], 15, 15, 4, [], 15, {}, 4, "5d40512e38f50600353e1588", "5d40512e38f50600353e1588"),
    new Food("somebody", "lkjlkjlskajd klasjd laksjd laks skld al", "Leírás", true, false, [], 15, 15, 4, [], 15, {}, 4, "5d40512e38f50600353e1588", "5d40512e38f50600353e1588"),
    new Food("somebody", "lkjlkjlskajd klasjd laksjd laks skld al", "Leírás", true, false, [], 15, 15, 4, [], 15, {}, 4, "5d40512e38f50600353e1588", "5d40512e38f50600353e1588"),
    new Food("somebody", "Spageti", "leírás", true, false, [], 15, 15, 4, [], 15, {}, 4, "5d42da817175860034c36b15", "5d42da817175860034c36b15"),
  ]

  constructor() { }

  ngOnInit() {
  }

}
