import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Food} from '../../../shared/models/grocery/food.model';
import {FoodService} from '../../../shared/services/food.service';
import {IdentityService} from '../../../shared/services/identity.service';
import {CookieService} from 'ngx-cookie-service';
import {MealingService} from '../../../shared/services/mealing.service';
import {Day} from '../../../shared/models/menu/day.model';
import {ISendableFood} from '../../../../../../Cookta-shared/src/models/food/food-sendable.interface';
import {ITag} from '../../../../../../Cookta-shared/src/models/tag/tag.interface';

@Component({
  selector: 'app-food-detail',
  templateUrl: './food-detail.component.html',
  styleUrls: ['./food-detail.component.scss']
})
export class FoodDetailComponent implements OnInit {

  public Food: ISendableFood;

  public ShowShortUnitNames: boolean;
  public ScaleToDose: number;

  public Recommendations: ISendableFood[];

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
      let day: Day | boolean = await this.mealingService.GetDay(Day) ?? await this.router.navigate(['foods', Id ?? '']);
            if (!day) return;
            let mealing = (day as Day).mealings[MealIndex];
            if (!mealing || mealing.type != 'final') {
                this.router.navigate(["foods", Id ?? '']);
                return;
            }
            this.Food = mealing.info.finalFood as ISendableFood;
            this.ScaleToDose = mealing.dose;
        } else {
      let data = await this.foodService.GetFoodPage(Id);
      this.Food = data.food;
      this.Recommendations = data.recommendations;
      this.ScaleToDose = this.Food.dose;
    }

    }

    public async Subscribe(state: boolean) {
        if (!this.identityService.LoggedIn) {
            this.identityService.PleaseLogin();
            return;
        }
        await this.foodService.SetSubscription(this.Food.foodId, state);
        this.Food.SubscribedFor = state;
    }

    public SaveShortUnitNameSettings() {
        //Reversed because (input) called before ngModel changing
        this.cookieService.set('short-units', !this.ShowShortUnitNames ? 't' : 'f')
    }

    public GoEdit() {
        this.router.navigate(["foods", this.Food.foodId, "edit"]);
    }

    GetFoodTags(): ITag[] {
        let origianls = this.Food.tags ? this.Food.tags : [];
        let autoTags = this.Food.autoTags ? this.Food.autoTags : [];
        return origianls.concat(autoTags);
    }

    GetFoodUrl(ObjFood: ISendableFood): string {
        return Food.GetImageForFood(ObjFood);
    }
}
