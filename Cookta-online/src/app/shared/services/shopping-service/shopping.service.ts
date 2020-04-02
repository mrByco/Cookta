import { Injectable } from '@angular/core';
import {ServerService} from "../server.service";
import {IIngredient} from "../../models/grocery/ingredient.interface";
import {Routes} from "../../routes";
import {Food} from "../../models/grocery/food.model";

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {

  public ShoppingItems: IIngredient[] = [];
  public IsBusy: boolean = false;
  public get GetSelectedShoppingDate(): Date {
    return this.m_SelectedShoppingDate;
  }
  private m_SelectedShoppingDate: Date = this.GetDateWithOffset(7);

  constructor(public serverService: ServerService) {

  }

  public async SetShoppingDate(date: Date): Promise<void>{
    date.setDate(date.getDate() + 1)
    this.m_SelectedShoppingDate = date;
    this.RefreshShoppingItems();
  }

  public async RefreshShoppingItems(): Promise<IIngredient[]>{
    return new Promise(async (resolve) => {
      let response = await this.serverService.GetRequest(Routes.Shopping.GetShoppingList.replace('{nextShopping}', this.GetSelectedShoppingDate.toISOString().slice(0, 10)));
      this.IsBusy = true;

      response.subscribe(data => {
        this.ShoppingItems.splice(0, this.ShoppingItems.length);
        for (const d of (data.IngredientsToBuy as IIngredient[])) {
          if (d != null) this.ShoppingItems.push(d);
        }
        this.IsBusy = false;
        resolve(this.ShoppingItems);
      }, () => {
        resolve([]);
      });
    })
  }

  public GetDateWithOffset(days: number): Date {
    let now = new Date(Date.now());
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + days);
  }

}
