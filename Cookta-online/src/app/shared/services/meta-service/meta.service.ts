import { Injectable } from '@angular/core';
import {Meta} from '@angular/platform-browser';
import {ISendableFood} from '../../../../../../Cookta-shared/src/models/food/food-sendable.interface';
import {Food} from '../../models/grocery/food.model';

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  constructor(private Meta: Meta) { }

  public SetFoodTags(food: ISendableFood){
    this.Meta.addTag({name: 'description', content: food.desc});
    this.Meta.addTag({name: 'og:title', content: food.name});
    this.Meta.addTag({name: 'og:image', content: Food.GetImageForFood(food)});
    this.Meta.addTag({name: 'og:type', content: 'recipe'});
  }

  public ResetMetaTags(){
    this.Meta.removeTag('description');
    this.Meta.removeTag('og:title');
    this.Meta.removeTag('og:image');
    this.Meta.removeTag('og:type');

  }
}
