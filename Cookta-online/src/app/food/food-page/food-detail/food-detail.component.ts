import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Food} from "../../../shared/models/grocery/food.model";
import {FoodService} from "../../../shared/services/food.service";
import {IdentityService} from "../../../shared/services/identity.service";
import {CookieService} from 'ngx-cookie-service';
import {MealingService} from "../../../shared/services/mealing.service";
import {Day} from "../../../shared/models/menu/day.model";

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
        public mealingService: MealingService,
        public cookieService: CookieService) {
    }


    public async ngOnInit() {
        this.ShowShortUnitNames = this.cookieService.get('short-units') == 't';

        let Id = this.route.snapshot.params['id'];
        let Day = this.route.snapshot.params['day'];
        let MealIndex = this.route.snapshot.params['mealIndex'];

        if (Day && MealIndex) {
            let day: Day | boolean = await this.mealingService.GetDay(Day) ?? await this.router.navigate(["foods", Id ?? '']);
            if (!day) return;
            let mealing = (day as Day).mealings[MealIndex];
            if (!mealing || mealing.type != 'final') {
                this.router.navigate(["foods", Id ?? '']);
                return;
            }
            this.Food = mealing.info.finalFood;
        } else {
            this.Food = await this.foodService.GetFood(Id);
        }

    }

    public async Subscribe(state: boolean) {
        if (!this.identityService.LoggedIn) {
            this.identityService.PleaseLogin();
            return;
        }
        let response = await this.foodService.SetSubscription(this.Food.foodId, state);
        this.Food.SubscribedFor = state;
    }

    public SaveShortUnitNameSettings() {
        //Reversed because (input) called before ngModel changing
        this.cookieService.set('short-units', !this.ShowShortUnitNames ? 't' : 'f')
    }


    public GoEdit() {
        this.router.navigate(["foods", this.Food.foodId, "edit"]);
    }
}
