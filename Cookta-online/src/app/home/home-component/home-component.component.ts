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

  public SpecRow1Content: IHomeRowContent;
  public SpecRow2Content: IHomeRowContent;
  public Rows: IHomeRowContent[];


  constructor(public homeService: HomeService) {
    this.homeService.RefreshStartPage();
  }

  ngOnInit(): void {
    if (this.homeService.HomeContent)
      this.GetRealContent();
    this.homeService.OnHomeContentChanged.subscribe(() => this.GetRealContent());
  }

  public async GetRealContent() {
    let requests: { code: string, args: string, count: number }[] = [];
    let content: IHomeContent = this.homeService.HomeContent;
    for (let req of [content.SpecRow1, content.SpecRow2, ...content.Rows]) {
      requests.push({code: req.type, args: req.arguments, count: 15});
    }
    let responses = await this.homeService.GetHomeContent(requests);
    if (!responses) return;
    this.SpecRow1Content = responses[0];
    this.SpecRow2Content = responses[1];
    this.Rows = responses.slice(2);
    for (let i = 0; i < this.Rows.length; i++) {
      this.Rows[i].big = content.Rows[i].big;
    }
  }

}
