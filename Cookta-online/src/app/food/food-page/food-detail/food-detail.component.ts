import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Food} from "../../../shared/models/grocery/food.model";
import {FoodService} from "../../../shared/services/food.service";
import {IdentityService} from "../../../shared/services/identity.service";
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-food-detail',
  templateUrl: './food-detail.component.html',
  styleUrls: ['./food-detail.component.scss']
})
export class FoodDetailComponent implements OnInit {

  public Food: Food = FoodService.Placeholder;
  public ShowShortUnitNames: boolean;
  constructor(
    public route: ActivatedRoute,
    public foodService: FoodService,
    public identityService: IdentityService,
    public router: Router,
    public cookieService: CookieService) { }


  async ngOnInit() {
    this.ShowShortUnitNames = this.cookieService.get('short-units') == 't';
    let Id = this.route.snapshot.params['id'];
    this.Food = await this.foodService.GetFood(Id);
    console.log(Food.name);
  }

  public SaveShortUnitNameSettings(){
    //Reversed because (input) called before ngModel changing
    this.cookieService.set('short-units', !this.ShowShortUnitNames ? 't' : 'f')
  }

  async Subscribe(state: boolean) {
    if (!this.identityService.LoggedIn){
      this.identityService.PleaseLogin();
      return;
    }
    let response = await this.foodService.SetSubscription(this.Food.foodId, state);
    this.Food.SubscribedFor = state;
    }

  GoEdit() {
    this.router.navigate(["foods", this.Food.foodId, "edit"]);
  }
}
