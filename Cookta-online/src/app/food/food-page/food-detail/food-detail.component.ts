import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Food} from "../../../shared/models/grocery/food.model";
import {FoodService} from "../../../shared/services/food.service";
import {IdentityService} from "../../../shared/services/identity.service";

@Component({
  selector: 'app-food-detail',
  templateUrl: './food-detail.component.html',
  styleUrls: ['./food-detail.component.scss']
})
export class FoodDetailComponent implements OnInit {

  public Food: Food = FoodService.Placeholder;
  constructor(
    private route: ActivatedRoute,
    private foodService: FoodService,
    private identityService: IdentityService,
    private router: Router) { }


  async ngOnInit() {
    let Id = this.route.snapshot.params['id'];
    this.Food = await this.foodService.GetFood(Id);
    console.log(Food.name);
  }

    Subscribe(state: boolean) {
    if (!this.identityService.LoggedIn){
      this.identityService.PleaseLogin();
      return;
    }
    this.Food.SubscribedFor = state;
    }

  GoEdit() {
    this.router.navigate(["foods", this.Food.foodId, "edit"]);
  }
}
