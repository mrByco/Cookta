import {Injectable} from '@angular/core';
import {IHomeContentRequest} from '../../../../../Cookta-shared/src/contracts/home/home-content.request';
import {IHomeRowContent} from '../../../../../Cookta-shared/src/models/home/home-row-content.interface';
import {ServerService} from './server.service';
import {IHomeContent} from '../../../../../Cookta-shared/src/models/home/home-content.interface';
import {Routes} from '../routes';
import {Observable, Subscriber} from 'rxjs';

@Injectable()
export class HomeService {

  public HomeContent: IHomeContent;
  public Started: Observable<boolean>;
  private StartedObserver: Subscriber<boolean>;

  constructor(public serverService: ServerService) {
    this.Started = new Observable<boolean>(observer => {
      this.StartedObserver = observer;
      observer.next(false);
    });

    this.GetHomeMarkup().then(h => {
      this.HomeContent = h;
      this.StartedObserver.next(true);
    });
  }


  public async GetHomeMarkup(): Promise<IHomeContent> {
    let response = await this.serverService.GetRequest(Routes.Home.GetHomeMarkup);
    return new Promise<IHomeContent>((resolve) => {
      response.subscribe(d => {
        let data = d as IHomeContent;
        resolve(data);
      });
    });

  }

  public async GetHomeContent(requests: IHomeContentRequest[]): Promise<IHomeRowContent[]> {
    let rowContents: IHomeRowContent[] = [];
    for (let request of requests) {
      let foods = [];
      rowContents.push({foods: foods.slice(0, request.count - 1), clickAction: 'open', title: 'Cimke legfrissebb ételei', other: null});
    }
    return rowContents;
  }
}
