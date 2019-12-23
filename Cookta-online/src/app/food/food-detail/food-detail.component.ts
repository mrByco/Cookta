import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Food} from "../../shared/models/grocery/food.model";
import {FoodService} from "../../shared/services/food.service";

@Component({
  selector: 'app-food-detail',
  templateUrl: './food-detail.component.html',
  styleUrls: ['./food-detail.component.css']
})
export class FoodDetailComponent implements OnInit {

  public Food: Food;
  constructor(
    private route: ActivatedRoute,
    private foodService: FoodService) { }


  async ngOnInit() {
    let Id = this.route.snapshot.params['id'];
    this.Food = await this.foodService.GetFood(Id);
    console.log(Food.name);
  }
}
