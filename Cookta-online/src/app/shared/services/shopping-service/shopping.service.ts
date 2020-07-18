import {Injectable} from '@angular/core';
import {ServerService} from '../server.service';
import {Routes} from '../../routes';
import {IShoppingList} from '../../../../../../Cookta-shared/src/models/shopping-list/shopping-list.interface';

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
    date.setDate(date.getDate() + 1)
    this.m_SelectedShoppingDate = date;
    this.RefreshShoppingItems();
  }

  public async RefreshShoppingItems(): Promise<void>{
    this.IsBusy = true;
    return new Promise(async (resolve) => {
      let response = await this.serverService.GetRequest(Routes.Shopping.GetShoppingList);

      response.subscribe(d => {
        this.IsBusy = false;
        let data: IShoppingList = d;
        Object.assign(this.CurrentShoppingList, d);
      }, () => {
        this.IsBusy = false;
        this.CurrentShoppingList = undefined;
        alert('Hiba a bevásárló lista elkészítésénél.')
        resolve();
      });
    })
  }

  public GetDateWithOffset(days: number): Date {
    let now = new Date(Date.now());
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + days);
  }

}
