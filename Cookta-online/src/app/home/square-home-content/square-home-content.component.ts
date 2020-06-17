import {Component, Input, OnInit} from '@angular/core';
import {ISquareContent} from "../../../../../Cookta-shared/src/models/start-page/square-conent.interface";

@Component({
  selector: 'app-square-home-content',
  templateUrl: './square-home-content.component.html',
  styleUrls: ['./square-home-content.component.css']
})
export class SquareHomeContentComponent implements OnInit {

  @Input("Data") public Content: ISquareContent;

  constructor() { }

  ngOnInit(): void {
  }

  Click() {
    console.log("click")
  }
}
