import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FoodService} from '../../../shared/services/food.service';
import {IdentityService} from '../../../shared/services/identity.service';
import {Food} from '../../../shared/models/grocery/food.model';
import {IIngredient} from '../../../shared/models/grocery/ingredient.interface';
import {Tag} from '../../../shared/models/grocery/tag.model';
import {ICanDeactivate} from '../../../guards/can-deactivate-guard';
import {MDBModalService} from 'angular-bootstrap-md';
import {GenericTwoButtonDialogComponent} from '../../../utilities/generic-two-button-dialog/generic-two-button-dialog.component';
import {FoodImageUploadComponent} from '../../food-assemblies/food-image-upload/food-image-upload.component';

@Component({
  selector: 'app-food-edit',
  templateUrl: './food-edit.component.html',
  styleUrls: ['./food-edit.component.scss']
})
export class FoodEditComponent implements OnInit, ICanDeactivate {


  public SavedFoodVersion: Food = FoodService.Placeholder;
  public CurrentFood: Food = FoodService.Placeholder;

  @ViewChild(FoodImageUploadComponent, {static: true}) public ImageCropper: FoodImageUploadComponent;

  constructor(
    private route: ActivatedRoute,
    private foodService: FoodService,
    private identityService: IdentityService,
    private router: Router,
    private modalService: MDBModalService) { }


  async ngOnInit() {
    let Id = this.route.snapshot.params['id'];
    if (Id == "new"){
      this.SavedFoodVersion = new Food(undefined, "", "", true, false, [], undefined, undefined, 4, undefined, undefined, undefined, undefined, [], [], false, true);
    }else{
      this.SavedFoodVersion = await this.foodService.GetFood(Id);
    }
    this.CreateWorkingFoodFrom(this.SavedFoodVersion);
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


  public async SaveFoodAndExit() {
    this.SavedFoodVersion = await this.foodService.UpdateFood(this.CurrentFood, this.ImageCropper.CroppedImage ? this.ImageCropper.CroppedImage : undefined);
    this.CreateWorkingFoodFrom(this.SavedFoodVersion);
    await this.router.navigate(['/foods', this.SavedFoodVersion.foodId]);
  }
  public async CancelEdit() {
    this.CreateWorkingFoodFrom(this.SavedFoodVersion);
    await this.router.navigate(['/foods', this.SavedFoodVersion.foodId]);
  }
  public async DeleteFood() {
    let conf = await confirm('Ezzel minden ételhez kötött adatod elvész, az ételhez kötött fényképek, hozzávalók, leírás, és feliratkozások. A receptet a feliratkózók is el fogják veszteni. Folytatod?')
    if (!conf) return;
    await this.foodService.DeleteFood(this.CurrentFood.foodId);
    await this.router.navigate(['foods','collection']);
  }

  public CanDeactivate(): Promise<boolean> | boolean {
    if (JSON.stringify(this.CurrentFood.ToJson()) == JSON.stringify(this.SavedFoodVersion.ToJson())){
      return true;
    }

    return new Promise<boolean>(resolve => {
      let component = this.modalService.show(GenericTwoButtonDialogComponent);
      let dialog = component.content as GenericTwoButtonDialogComponent;
      dialog.Title = "Mentetlen változások";
      dialog.Desc = "Biztos továbblépsz a recept mentése nélkül?";
      dialog.SuccessText = "Mentés";
      dialog.FailText = "Elvetés";
      dialog.OnCancel.subscribe(() => resolve(false));
      dialog.OnFail.subscribe(() => resolve(true));
      dialog.OnSuccess.subscribe(() => {
        this.foodService.UpdateFood(this.CurrentFood).then(() => {
          resolve(true);
        });
      });
    });
  }

  private CreateWorkingFoodFrom(food: Food){
    this.CurrentFood = new Food(
        food.owner,
        food.name,
        food.desc,
        this.SavedFoodVersion.isPrivate,
        food.published,
        [...food.ingredients],
        food.imageUploaded,
        food.uploaded,
        food.dose,
        this.SavedFoodVersion.lastModified,
        food.subscriptions,
        food.id,
        this.SavedFoodVersion.foodId,
        [...food.tags],
        [...food.autoTags],
        food.SubscribedFor,
        food.OwnFood
    );
  }


  async ChangeVisibility(visibility: boolean) {
    if (!visibility && this.CurrentFood.published) {
      if (!await confirm('Ezzel az akcióval elveszíted a feliratkozóidat, ők pedig téged! Biztos folytatod?\n Ezt a beállítás mentéskor fog érvényesülni addig visszavonhatod')) return;
    }
    this.CurrentFood.isPrivate = !visibility;
  }

  DeleteImage() {
    this.ImageCropper.EditMode = false;
    this.ImageCropper.DeleteImage();
    this.CurrentFood.imageUploaded = null;

    this.foodService.DeleteImage(this.CurrentFood.id);
  }
}
