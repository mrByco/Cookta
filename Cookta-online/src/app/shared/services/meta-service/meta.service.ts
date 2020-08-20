import { Injectable } from '@angular/core';
import {Meta} from '@angular/platform-browser';
import {ISendableFood} from '../../../../../../Cookta-shared/src/models/food/food-sendable.interface';
import {Food} from '../../models/grocery/food.model';

@Injectable({
  providedIn: 'root'
})
export class MetaService {


  public readonly Tags: HTMLMetaElement[] = [];

  constructor(private Meta: Meta) { }

  public SetFoodTags(food: ISendableFood){
    this.Tags.push(this.Meta.addTag({name: 'description', property: "description", content: food.desc}));
    this.Tags.push(this.Meta.addTag({name: 'og:description', property: "og:description", content: food.desc}));
    this.Tags.push(this.Meta.addTag({name: 'og:title', property: "og:title", content: food.name}));
    this.Tags.push(this.Meta.addTag({name: 'og:image', property: "og:image", content: Food.GetImageForFood(food)}));
    this.Tags.push(this.Meta.addTag({name: 'og:type', property: "og:type", content: 'recipe'}));
  }

  public ResetMetaTags(){
    this.Tags.forEach(t => this.Meta.removeTagElement(t));
  }
}
