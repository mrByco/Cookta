import {Component, Input, OnInit} from '@angular/core';
import {IHomeRowContent} from "../../../../../Cookta-shared/src/models/home/home-row-content.interface";
import {ISendableFood} from "../../../../../Cookta-shared/src/models/food/food-sendable.interface";
import {Food} from "../../shared/models/grocery/food.model";

@Component({
  selector: 'app-row-home-content',
  templateUrl: './row-home-content.component.html',
  styleUrls: ['./row-home-content.component.scss']
})
export class RowHomeContentComponent implements OnInit {

  @Input("Content") public Content: IHomeRowContent;

  constructor() {

  }

  ngOnInit(): void {

  }

  public GetFoodImage(food: ISendableFood){
    return Food.GetImageForFood(food);
  }

}
