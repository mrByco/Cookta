import {Component, OnInit} from '@angular/core';
import {IHomeContent} from '../../../../../Cookta-shared/src/models/home/home-content.interface';
import {IHomeRowContent} from '../../../../../Cookta-shared/src/models/home/home-row-content.interface';
import {HomeService} from '../../shared/services/home.service';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent implements OnInit {

  public Content: IHomeContent;
  public SpecRow1Content: IHomeRowContent;
  public SpecRow2Content: IHomeRowContent;
  public Rows: IHomeRowContent[];


  constructor(public homeService: HomeService) {
  }

  ngOnInit(): void {
    this.Content = {
      Rows: [
        {type: "tag-last", arguments: "[tagname]", big:true},
        {type: "tag-last", arguments: "[tagname]", big:false},
        {type: "tag-last", arguments: "[tagname]", big:false},
        {type: "tag-last", arguments: "[tagname]", big:true},
        {type: "tag-last", arguments: "[tagname]", big:false},
        {type: "tag-last", arguments: "[tagname]", big:false}
      ],
      SpecRow1: {type: "special", arguments: "last", big: false},
      SpecRow2: {type: "special", arguments: "weeklytop", big: false},
      Square: {
        images: [
          {
            subtitle: "tejbegríz",
            url: "https://kuktaimages.blob.core.windows.net/foodimages/5d43ea207f32c5003453351a.jpg"
          },
          {
            subtitle: "sült krumpli",
            url: "https://kuktaimages.blob.core.windows.net/foodimages/5ea840afaf8474561c124666.jpg"
          },
          {
            subtitle: "csirkemell",
            url: "https://kuktaimages.blob.core.windows.net/foodimages/5ec3b99a6edc2b3c64368eae.jpg"
          }
        ],
        title: "Mai fogások",
        clickAction: "navigate|calendar|date:2020-07-17;text:"
      }
    }
    this.GetRealContent();
  }

  public async GetRealContent() {
    let requests: {code: string, args: string, count: number}[] = []
    for (let req of [this.Content.SpecRow1, this.Content.SpecRow2, ...this.Content.Rows]){
      requests.push({code: req.type, args: req.arguments, count: 15})
    }
    let responses = await this.homeService.GetHomeContent(requests);
    this.SpecRow1Content = responses[0];
    this.SpecRow2Content = responses[1];
    this.Rows = responses.slice(2);
    for (let i = 0; i < this.Rows.length; i++){
      this.Rows[i].big = this.Content.Rows[i].big
    }
  }

}
