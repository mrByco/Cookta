import {Injectable} from '@angular/core';
import {IIngredient} from "../models/grocery/ingredient.interface";
import {Routes} from "../routes";
import {ServerService} from "./server.service";
import {DisplayIngredient} from "../ingredient-display";
import {IngredientService} from "./ingredient.service";
import {UnitService} from "./unit.service";

@Injectable({
  providedIn: 'root'
})
export class EssentialsService {

  constructor(public serverService: ServerService, private ingredientService: IngredientService, private unitService: UnitService) {
    this.RefreshEssentials();
  }

  public readonly Essentials: IIngredient[] = [];

  public async RefreshEssentials() {
    this.Essentials.splice(0, this.Essentials.length);

    await new Promise(async (resolve) => {
      let response = await this.serverService.GetRequest(Routes.Essentials.GetEssentials);
      response.subscribe(data => {
        for (const d of (data as any)) {
          this.Essentials.push(d as IIngredient);
        }
        resolve();
      }, () => {
        resolve();
      });
    })
  }
  public async SetEssentials(){

    await new Promise(async (resolve) => {
      let response = await this.serverService.PostRequest(Routes.Essentials.SetEssentials, this.Essentials);
      response.subscribe(data => {
        this.Essentials.splice(0, this.Essentials.length);
        for (const d of (data as any)) {
          this.Essentials.push(d as IIngredient);
        }
        resolve();
      }, () => {
        resolve();
      });
    })
  }

  GetDisplays() {
    return this.Essentials.map(i => new DisplayIngredient(i, this.ingredientService, this.unitService));
  }
}
