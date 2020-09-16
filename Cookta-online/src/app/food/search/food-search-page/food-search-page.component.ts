import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ISendableFood} from "../../../../../../Cookta-shared/src/models/food/food-sendable.interface";
import {FoodService} from "../../../shared/services/food.service";
import {SearchService} from "../search.service";

@Component({
  selector: 'app-food-search-page',
  templateUrl: './food-search-page.component.html',
  styleUrls: ['./food-search-page.component.css']
})
export class FoodSearchPageComponent implements OnInit, AfterViewInit {
  Foods: ISendableFood[] = [];

  @ViewChild("root") Root: ElementRef;
  ShowFoods: boolean;

  constructor(public foodService: FoodService, public searchService: SearchService) {
    searchService.ResetTextSilently();
  }

  async ngOnInit() {
    this.Foods = await this.foodService.GetLastFoods(20);
  }

  async ngAfterViewInit() {
    let width = this.Root.nativeElement.offsetWidth;
    this.ShowFoods = width > 450;
  }

}
