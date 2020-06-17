import { Component, OnInit } from '@angular/core';
import {IStartPageContent} from "../../../../../Cookta-shared/src/models/start-page/start-page-content.interface";

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent implements OnInit {

  public Content: IStartPageContent;

  constructor() { }

  ngOnInit(): void {
    this.Content = {
      Rows: [],
      SpecRow1: undefined,
      SpecRow2: undefined,
      Square: {
        images: [
          {subtitle: "tejbegríz", url: "https://kuktaimages.blob.core.windows.net/foodimages/5d43ea207f32c5003453351a.jpg"},
          {subtitle: "sült krumpli", url: "https://kuktaimages.blob.core.windows.net/foodimages/5ea840afaf8474561c124666.jpg"},
          {subtitle: "csirkemell", url: "https://kuktaimages.blob.core.windows.net/foodimages/5ec3b99a6edc2b3c64368eae.jpg"}
        ],
        title: "Mai fogások",
        clickAction: "navigate|calendar|date:2020-07-17;text:"
      }

    }
  }

}
