import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public DisplayLoading: boolean = true;
  public static instance: AppComponent;

  public NeedCheckPermission: boolean;

  constructor() {

    this.NeedCheckPermission = false;
    if (window.location.hostname.match('192\\.168\\.\\d{1,3}\\.\\d{1,3}')){
      console.log('Its local ip. Running in test mode');
      this.NeedCheckPermission = true;
    }
    else if (window.location.hostname.match('localhost')){
      console.log('Its localhost. Running in normal mode');
      this.NeedCheckPermission = true;
    }
    else if (window.location.hostname.match('test\\.cookta\\.online')) {
      console.log('Test cookta running test mode');
      this.NeedCheckPermission = true;
    }
    else if (window.location.hostname.match('cookta\\.online')){
      console.log('Prod cookta running normal mode');
      this.NeedCheckPermission = false;
    }else {
      console.log('Not valid url redirect to cookta.online')
      window.location.href = 'https://cookta.online/';
    }
    AppComponent.instance = this;
  }
}
