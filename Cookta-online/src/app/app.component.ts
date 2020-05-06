import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public DisplayLoading: boolean = true;
  public static instance: AppComponent;

  constructor() {
    AppComponent.instance = this;
  }
}
