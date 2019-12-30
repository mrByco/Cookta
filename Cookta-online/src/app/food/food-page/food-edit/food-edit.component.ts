import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FoodService} from "../../../shared/services/food.service";
import {IdentityService} from "../../../shared/services/identity.service";
import {Food} from "../../../shared/models/grocery/food.model";
import {IngredientAdderComponent} from "../../food-assemblies/ingredient-adder/ingredient-adder.component";
import {IIngredient} from "../../../shared/models/grocery/ingredient.interface";
import {Tag} from "../../../shared/models/grocery/tag.model";

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
    private identityService: IdentityService,
    private router: Router) { }


  async ngOnInit() {
    let Id = this.route.snapshot.params['id'];
    if (Id == "new"){
      this.SourceFood = new Food(undefined, "", "", true, false, [], undefined, undefined, undefined, undefined, undefined, undefined, undefined, [], []);
    }else{
      this.SourceFood = await this.foodService.GetFood(Id);
    }
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



  DeleteIngredient(ingredient: IIngredient) {
    this.CurrentFood.ingredients.splice(this.CurrentFood.ingredients.findIndex(i => i == ingredient), 1);
  }
  DeleteTag(tag: Tag) {
    this.CurrentFood.tags.splice(this.CurrentFood.tags.findIndex(i => i == tag), 1);
  }

  AddIngredient(ingredient: IIngredient) {
    this.CurrentFood.ingredients.push(ingredient);
  }
  AddTag(tag: Tag) {
    this.CurrentFood.tags.push(tag);
  }


  public async SaveFood() {
    let food = await this.foodService.UpdateFood(this.CurrentFood);
    await this.router.navigate(['/foods', food.foodId]);
  }
  public CancelEdit() {

  }
  public async DeleteFood() {
    await this.foodService.DeleteFood(this.CurrentFood.foodId);
    await this.router.navigate(['/foods', this.CurrentFood.foodId]);
  }

}
