import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Food} from "../../shared/models/grocery/food.model";
import {FoodService} from "../../shared/services/food.service";
import {IdentityService} from "../../shared/services/identity.service";

@Component({
  selector: 'app-food-detail',
  templateUrl: './food-detail.component.html',
  styleUrls: ['./food-detail.component.scss']
})
export class FoodDetailComponent implements OnInit {

  public Food: Food;
  constructor(
    private route: ActivatedRoute,
    private foodService: FoodService,
    private identityService: IdentityService) { }


  async ngOnInit() {
    let Id = this.route.snapshot.params['id'];
    this.Food = await this.foodService.GetFood(Id);
    console.log(Food.name);
  }

  Subscribe() {
    if (!this.identityService.LoggedIn){
      this.identityService.PleaseLogin();
      return;
    }
    //Subscribe
  }
}
