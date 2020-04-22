import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {IPoolItem} from "../pool-item-interface";


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
            transition('*<=>*', animate('200ms ease-in-out'))
        ])
    ]
})
export class MenuPoolItemComponent implements OnInit {
    public m_State = 'void';
    @Input() public Width: number;
    @Input() public Height: number;
    @Input() public HorMargin: number;
    @Input() public VertMargin: number;
    @Input() public Item: IPoolItem;
    private MinDelay: number = 210;
    private MaxDelay: number = 500;

    @Input() public Selected: boolean;
    @Output() public OnSelected: EventEmitter<IPoolItem> = new EventEmitter<IPoolItem>();

    constructor() {
    }

    @Input()
    public set ItemState(value) {
        setTimeout(() => this.m_State = value, (Math.random() * (this.MaxDelay - this.MinDelay)) + this.MinDelay);
    }

    ngOnInit(): void {
    }

}
