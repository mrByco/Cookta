import {Component, Input, OnInit} from '@angular/core';
import {Food} from "../../shared/models/grocery/food.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-food-item',
  templateUrl: './food-item.component.html',
  styleUrls: ['./food-item.component.css']
})
export class FoodItemComponent implements OnInit {

  @Input() Food: Food;

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  async OnCardClick() {
    await this.router.navigate(['/foods', this.Food.foodId])
  }
}
