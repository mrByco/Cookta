import {Component, OnInit} from '@angular/core';
import {LoadingState} from '../shared/app-loading-state';
import {IngredientService} from "../shared/services/ingredient.service";
import {TagService} from "../shared/services/tag.service";


@Component({
  selector: 'app-root-component',
  templateUrl: './root-component.component.html',
  styleUrls: ['./root-component.component.css']
})
export class RootComponentComponent implements OnInit {

  public static readonly HeaderSize = 70;

  get LoadingState(): LoadingState {
    return this.loadingState;
  }
  private loadingState: LoadingState = 0;

  constructor(private IngredientService: IngredientService,
              private TagService: TagService)
  {
    console.log("Loading ings");
    this.loadingState = LoadingState.Ingredients;
    this.IngredientService.IngredientTypes.then(types => {
    }).then(() => {
      this.TagService.TagsAsync.then(() => {
        this.loadingState = LoadingState.Ready;
        console.log("Done");
      })
    });
  }

  ngOnInit() {

  }
}
