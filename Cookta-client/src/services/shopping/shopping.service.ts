import { Injectable } from '@angular/core';
import {ShoppingApi} from '~/api/shopping-api';
import {ServerService} from '~/services/server/server.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {

  public shoppingItems: any;
  private shoppingApi: ShoppingApi;

  constructor(private serverService: ServerService) {
    this.shoppingApi = new ShoppingApi();
    this.shoppingApi.GetShoppingList(serverService.GetCaller, "2020-08-14").then(r => {
      this.shoppingItems = r;
      console.log(r.IngredientsToBuy)
    });
  }
}
