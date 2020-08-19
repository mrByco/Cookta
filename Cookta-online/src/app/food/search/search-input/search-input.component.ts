import {Component, OnInit, ViewChild} from '@angular/core';
import {SearchService} from "../search.service";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent {

  @ViewChild("searchForm") public input: FormControl;

  constructor(public searchService: SearchService) {
  }

  SearchRequested() {
    this.searchService.Search(this.input.value.searchText);
  }

}
