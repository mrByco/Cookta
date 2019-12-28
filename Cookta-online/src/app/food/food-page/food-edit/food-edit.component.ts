import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FoodService} from "../../../shared/services/food.service";
import {IdentityService} from "../../../shared/services/identity.service";
import {Food} from "../../../shared/models/grocery/food.model";
import {IngredientAdderComponent} from "../../food-assemblies/ingredient-adder/ingredient-adder.component";

@Component({
  selector: 'app-food-edit',
  templateUrl: './food-edit.component.html',
  styleUrls: ['./food-edit.component.scss']
})
export class FoodEditComponent implements OnInit {


  public SourceFood: Food = FoodService.Placeholder;
  public CurrentFood: Food = FoodService.Placeholder;


  constructor(
    private route: ActivatedRoute,
    private foodService: FoodService,
    private identityService: IdentityService) { }


  async ngOnInit() {
    let Id = this.route.snapshot.params['id'];
    this.SourceFood = await this.foodService.GetFood(Id);
    this.CurrentFood = new Food(
      this.SourceFood.owner,
      this.SourceFood.name,
      this.SourceFood.desc,
      this.SourceFood.isPrivate,
      this.SourceFood.published,
      this.SourceFood.ingredients,
      this.SourceFood.imageUploaded,
      this.SourceFood.uploaded,
      this.SourceFood.dose,
      this.SourceFood.lastModified,
      this.SourceFood.subscriptions,
      this.SourceFood.id,
      this.SourceFood.foodId,
      this.SourceFood.tags,
      this.SourceFood.autoTags
    );
  }

  Subscribe() {
    if (!this.identityService.LoggedIn){
      this.identityService.PleaseLogin();
      return;
    }
    //Subscribe
  }


}
