import {ServerService} from './server.service';
import {Injectable} from '@angular/core';
import {Day} from '../models/menu/day.model';
import {Routes} from '../routes';
import {Food} from '../models/grocery/food.model';
import {Meal} from "../models/menu/mealing.interface";

@Injectable()
export class MealingService {

  constructor(public serverService: ServerService) {

  }

  public async GetDay(date: string): Promise<Day> {
    return new Promise(async (resolve) => {
      let response = await this.serverService.GetRequest(Routes.Menu.GetDay.replace('{date}', date));
      response.subscribe(data => {
        resolve(new Day(data['date'], data['mealings'], data['familyId']));
      }, () => {
        resolve(null);
      });
    })
  }

  public async SetDay(date: string, meals: Meal[]): Promise<Day> {
    return new Promise(async (resolve) => {
      let response = await this.serverService.PutRequest(Routes.Menu.SetDay.replace('{date}', date), meals);
      response.subscribe(data => {
        resolve(new Day(data['date'], data['mealings'], data['familyId']));
      }, () => {
        resolve(null);
      });
    })
  }

  public async RefreshMealing(date: string, mealIndex: number): Promise<Day> {
    return new Promise(async (resolve) => {
      let response = await this.serverService.GetRequest(Routes.Menu.RefreshDay.replace('{date}', date).replace('{mealingIdentity}', mealIndex.toString()));
      response.subscribe(data => {
        resolve(new Day(data['date'], data['mealings'], data['familyId']));
      }, () => {
        resolve(null);
      });
    })
  }


}
