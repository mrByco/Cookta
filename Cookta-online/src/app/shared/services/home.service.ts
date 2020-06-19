import {Injectable} from '@angular/core';
import {IHomeContentRequest} from '../../../../../Cookta-shared/src/contracts/home/home-content.request';
import {IHomeRowContent} from '../../../../../Cookta-shared/src/models/home/home-row-content.interface';
import {ServerService} from './server.service';
import {IHomeContent} from '../../../../../Cookta-shared/src/models/home/home-content.interface';
import {Routes} from '../routes';

@Injectable()
export class HomeService {

  public HomeContent: IHomeContent;
  public StartProcess: Promise<void>;

  constructor(public serverService: ServerService) {
    this.StartProcess = this.GetHomeMarkup().then(h => {
      this.HomeContent = h;
    });
  }

  public async RefreshStartPage(): Promise<void> {
    return new Promise(resolve => {
      if (this.HomeContent) resolve();
      else this.StartProcess.then(() => resolve());
    });
  }

  public async GetHomeMarkup(): Promise<IHomeContent> {
    let response = await this.serverService.GetRequest(Routes.Home.GetHomeMarkup);
    return new Promise<IHomeContent>((resolve) => {
      response.subscribe(d => {
        let data = d as IHomeContent;
        resolve(data);
      }, () => resolve(null));
    });

  }

  public async GetHomeContent(body: IHomeContentRequest[]): Promise<IHomeRowContent[]> {
    let rowContents: IHomeRowContent[] = [];
    let response = await this.serverService.PutRequest(Routes.Home.GetContent, body);
    return new Promise<IHomeRowContent[]>(resolve => {
      response.subscribe(d => {
        let data = d as IHomeRowContent[];
        resolve(data);
      }, () => {
        resolve(null);
      });
    });
  }
}
