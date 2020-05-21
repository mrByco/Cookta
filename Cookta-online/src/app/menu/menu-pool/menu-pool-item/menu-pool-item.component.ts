import {Component, EventEmitter, Input, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {IPoolItem} from "../pool-item-interface";
import {IStateChanger, PoolItemAnimationService} from "../pool-animation-service";
import {Food} from "../../../shared/models/grocery/food.model";
import { Tag } from 'src/app/shared/models/grocery/tag.model';
import {Router} from "@angular/router";


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
            transition('*<=>*', animate('200ms ease-in-out')),
        ])
    ]
})
export class MenuPoolItemComponent {
    public State: string = 'void';
    @Input() public Width: number;
    @Input() public Height: number;
    @Input() public HorMargin: number;
    @Input() public VertMargin: number;
    @Input() public Item: IPoolItem;
    private MinDelay: number = 210;
    private MaxDelay: number = 500;

    @Input() public Selected: boolean;
    @Output() public OnSelected: EventEmitter<IPoolItem> = new EventEmitter<IPoolItem>();

    private cancel: () => void;

    constructor(private poolAnimationService: PoolItemAnimationService,
                private router: Router) {
        this.ChangeState(poolAnimationService.ChangeOnInit);
        poolAnimationService.OnStateChange.subscribe(c => {
            this.ChangeState(c);
        })
    }

    async ChangeState(changer: IStateChanger) {
        try {
            if (changer.useDelay)
                await new Promise((resolve, reject) => {
                    if (this.cancel) {
                        this.cancel();
                    }
                    this.cancel = () => reject('Operation canceled');
                    setTimeout(resolve, (Math.random() * (this.MaxDelay - this.MinDelay)) + this.MinDelay);
                });
            this.State = changer.target;
            this.cancel = undefined;
        } catch (error) {
            if (error != 'Operation canceled')
                console.error(error);
        }
    }

    Open() {
        if (this.IsFood()) this.router.navigate(['foods', (this.Item.original as Food).foodId]);
        if (this.IsTag()) this.router.navigate(['calendar'],
            {queryParams: {search: 'tag', text: this.Item.original.displayName()}});
    }

    IsFood(){
        return this.Item.original instanceof Food;
    }
    IsTag(){
        return this.Item.original instanceof Tag;
    }
}
