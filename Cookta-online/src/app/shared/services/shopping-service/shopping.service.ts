import {Injectable} from '@angular/core';
import {ServerService} from '../server.service';
import {Routes} from '../../routes';
import {
  ICompletedShoppingItem,
  IShoppingList
} from '../../../../../../Cookta-shared/src/models/shopping-list/shopping-list.interface';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {


  public CurrentShoppingList: IShoppingList;

  public IsBusy: boolean = false;

  public get GetSelectedShoppingDate(): Date {
    return this.m_SelectedShoppingDate;
  }
  private m_SelectedShoppingDate: Date = this.GetDateWithOffset(7);

  constructor(public serverService: ServerService) {

  }

  public async SetShoppingDate(date: Date): Promise<void>{
    date.setDate(date.getDate())
    this.m_SelectedShoppingDate = date;
    this.RefreshShoppingItems();
  }

  public async FinishShoppingList(cancelItems: boolean){
    this.IsBusy = true;
    this.CurrentShoppingList = undefined;
    return new Promise(async (resolve) => {
      let response = await this.serverService.PutRequest(Routes.Shopping.ShoppingListBase + '/new', {cancelItems: cancelItems});
      response.subscribe(d => {
        this.IsBusy = false;
        let data: IShoppingList = d;
        this.CurrentShoppingList = data;
      }, () => {
        this.IsBusy = false;
        this.CurrentShoppingList = undefined;
        alert('Hiba a bevásárló lista elkészítésénél.')
        resolve();
      });
    });
  }

  public async RefreshShoppingItems(): Promise<void>{
    this.IsBusy = true;
    return new Promise(async (resolve) => {
      let response = await this.serverService.GetRequest(Routes.Shopping.ShoppingListBase + '/' + this.GetSelectedShoppingDate.toISOString().slice(0, 10));
      response.subscribe(d => {
        this.IsBusy = false;
        let data: IShoppingList = d;
        this.CurrentShoppingList = data;
      }, () => {
        this.IsBusy = false;
        this.CurrentShoppingList = undefined;
        alert('Hiba a bevásárló lista elkészítésénél.')
        resolve();
      });
    });
  }

  public async SetComplete(ingredientId: string, complete: boolean): Promise<void>{
    this.IsBusy = true;
    let body: {IngredientId: string, complete: boolean} = {IngredientId: ingredientId, complete: complete}
    return new Promise(async (resolve) => {
      let response = await this.serverService.PutRequest(Routes.Shopping.ShoppingListBase + '/complete', body);
      response.subscribe(d => {
        this.IsBusy = false;
        let data: IShoppingList = d;
        this.CurrentShoppingList = data;
      }, () => {
        this.IsBusy = false;
        this.CurrentShoppingList = undefined;
        alert('Hiba a bevásárló lista frissítésénél.')
        resolve();
      });
    })
  }

  public async SetCanceled(ingredientId: string, canceled: boolean): Promise<void>{
    this.IsBusy = true;
    let body: {IngredientId: string, Canceled: boolean} = {IngredientId: ingredientId, Canceled: canceled}
    return new Promise(async (resolve) => {
      let response = await this.serverService.PutRequest(Routes.Shopping.ShoppingListBase + '/canceled', body);
      response.subscribe(d => {
        this.IsBusy = false;
        let data: IShoppingList = d;
        this.CurrentShoppingList = data;
      }, () => {
        this.IsBusy = false;
        this.CurrentShoppingList = undefined;
        alert('Hiba a bevásárló lista frissítésénél.')
        resolve();
      });
    })
  }

  public GetDateWithOffset(days: number): Date {
    let now = new Date(Date.now());
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + days);
  }

  public async SaveCompletedItem(save: ICompletedShoppingItem): Promise<void> {
    let body: {Item: ICompletedShoppingItem} = {Item: {...save}}
    if (!body.Item.Bought?.Value || !body.Item.Bought?.UnitId) body.Item.Bought = undefined;

    return new Promise(async (resolve) => {
      let response = await this.serverService.PutRequest(Routes.Shopping.ShoppingListBase + '/qty', body);
      response.subscribe(d => {
        resolve();
      }, () => {
        this.CurrentShoppingList = undefined;
        alert('Hiba a mennyiség frissítésénél.')
        resolve();
      });
    })
  }

}
