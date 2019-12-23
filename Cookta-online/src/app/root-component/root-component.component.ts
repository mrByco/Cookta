import { Component, OnInit } from '@angular/core';
import {LoadingState} from '../shared/app-loading-state';


@Component({
  selector: 'app-root-component',
  templateUrl: './root-component.component.html',
  styleUrls: ['./root-component.component.css']
})
export class RootComponentComponent implements OnInit {

  private LoadingState: LoadingState

  constructor() { }

  ngOnInit() {
  }
}
