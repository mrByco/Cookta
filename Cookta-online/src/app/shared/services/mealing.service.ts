import {ServerService} from './server.service';
import {Injectable} from '@angular/core';
import {Day} from '../models/menu/day.model';
import {Routes} from '../routes';
import {Food} from '../models/grocery/food.model';

@Injectable()
export class MealingService {

  constructor(public serverService: ServerService) {

  }

  public async GetDay(date: string): Promise<Day> {
    return new Promise(async (resolve) => {
      let response = await this.serverService.GetRequest(Routes.Menu.GetDay);
      response.subscribe(data => {
        resolve(new Day(data['date'], data['mealings'], data['familyId']));
      }, () => {
        resolve(null);
      });
    })
  }


}
