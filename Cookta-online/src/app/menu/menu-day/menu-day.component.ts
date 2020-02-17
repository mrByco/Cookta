import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {Day} from '../../shared/models/menu/day.model';
import {DatePipe} from '@angular/common';
import {MealingService} from "../../shared/services/mealing.service";
import {Meal} from "../../shared/models/menu/mealing.interface";
import {MenuEditorComponent} from "../menu-editor/menu-editor.component";

@Component({
  selector: 'app-menu-day',
  templateUrl: './menu-day.component.html',
  styleUrls: ['./menu-day.component.css']
})
export class MenuDayComponent implements OnInit {

  @Input() SelectedItem: any;
  @Input() MenuEditorComponent: MenuEditorComponent;
  public OnDayChanged: EventEmitter<Day> = new EventEmitter<Day>();

  public async SetCurrentDay(date: string): Promise<void> {
    this.CurrentDay = await this.mealingService.GetDay(date);
    this.OnDayChanged.emit(this.CurrentDay);
  }

  public async NavDay(day: number) {
    let currentDate: Date = new Date(this.CurrentDay.date);
    currentDate.setDate(currentDate.getDate() + day);
    await this.SetCurrentDay(currentDate.toISOString().split('T')[0]);
  }


  public CurrentDay: Day = Day.PlaceHolder;

  public GetCurrentDayName(date: string) {
    let currentDate: Date = new Date(this.CurrentDay.date);
    switch (currentDate.getDay()) {
      case 1:
        return "Hétfő";
      case 2:
        return "Kedd";
      case 3:
        return "Szerda";
      case 4:
        return "Csütörtök";
      case 5:
        return "Péntek";
      case 6:
        return "Szombat";
      case 0:
        return "Vasárnap";
    }
  }

  constructor(public mealingService: MealingService) {
  }

  public AddItemToDay(meal: Meal) {
    this.MenuEditorComponent.SelectItem(null);
    this.CurrentDay.mealings.push(meal);
    this.SaveDay();
    this.OnDayChanged.emit(this.CurrentDay);
  }

  public SaveDay() {
    this.mealingService.SetDay(this.CurrentDay.date, this.CurrentDay.mealings).then(d => {
      this.CurrentDay = d;
      this.OnDayChanged.emit(this.CurrentDay);
    });
  }

  async ngOnInit() {
    let today: Date = new Date(Date.now());
    await this.SetCurrentDay(today.toISOString().split('T')[0]);
  }
}
