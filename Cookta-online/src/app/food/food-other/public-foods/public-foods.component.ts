import {Component, OnInit} from '@angular/core';
import {ISendableFood} from '../../../../../../Cookta-shared/src/models/food/food-sendable.interface';
import {FoodService} from '../../../shared/services/food.service';

@Component({
  selector: 'app-public-foods',
  templateUrl: './public-foods.component.html',
  styleUrls: ['./public-foods.component.css']
})
export class PublicFoodsComponent implements OnInit {
  public Foods: ISendableFood[] = [];

  constructor(public foodService: FoodService) {
  }

  ngOnInit(): void {
    this.foodService.GetFoods().then(f => this.Foods = f);
  }

}
