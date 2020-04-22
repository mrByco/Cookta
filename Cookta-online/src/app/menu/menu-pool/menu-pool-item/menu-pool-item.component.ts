import {Component, Input, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";



@Component({
  selector: 'app-menu-pool-item',
  templateUrl: './menu-pool-item.component.html',
  styleUrls: ['./menu-pool-item.component.css'],
  animations: [
    trigger('ItemInOut', [
      state('void', style({
        transform: 'scale(0)',
        opacity: '0'
      })),
      state('in', style({
        transform: 'scale(1)',
        opacity: '1'
      })),
      transition('*<=>*', animate('250ms ease-in'))
    ])
  ]
})
export class MenuPoolItemComponent implements OnInit {
  public m_State;
  @Input() public Width: number;
  @Input() public Height: number;
  @Input() public HorMargin: number;
  @Input() public VertMargin: number;
  private MinDelay: number = 0;
  private MaxDelay: number = 300;

  constructor() { }

  @Input() public set ItemState(value) {
    setTimeout(() => this.m_State = value, (Math.random() * (this.MaxDelay - this.MinDelay)) + this.MinDelay);
  }

  ngOnInit(): void {
  }

}
