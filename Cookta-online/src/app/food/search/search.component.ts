import { Component, OnInit } from '@angular/core';
import {SearchService} from "./search.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Food} from "../../shared/models/grocery/food.model";
import { ISendableFood } from '../../../../../Cookta-shared/src/models/food/food-sendable.interface';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(public route: ActivatedRoute, public searchService: SearchService) { }

  ngOnInit(): void {
    this.searchService.Search(this.route.snapshot.params['text']);
  }

  public GetImageForFood(food: ISendableFood){
    return Food.GetImageForFood(food)
  }

}
