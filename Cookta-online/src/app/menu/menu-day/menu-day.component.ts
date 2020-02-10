import { Component, OnInit } from '@angular/core';
import {Day} from '../../shared/models/menu/day.model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-menu-day',
  templateUrl: './menu-day.component.html',
  styleUrls: ['./menu-day.component.css']
})
export class MenuDayComponent implements OnInit {

  public async SetCurrentDay(date: string): Promise<void>{

  }

  public CurrentDay: Day = Day.PlaceHolder;

  constructor() { }


  //TODO Do it working: set Current day to today
  ngOnInit() {
    this.SetCurrentDay(Date.now().ToString("yyyy-MM-dd"))
  }

}
