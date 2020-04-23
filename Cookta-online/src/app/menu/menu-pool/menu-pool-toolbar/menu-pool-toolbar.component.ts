import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EPoolSearchType} from "../pool-search-type-enum";

@Component({
    selector: 'app-menu-pool-toolbar',
    templateUrl: './menu-pool-toolbar.component.html',
    styleUrls: ['./menu-pool-toolbar.component.css']
})
export class MenuPoolToolbarComponent implements OnInit {


    @Input() SearchText: string = '';
    @Output() SearchTextChange = new EventEmitter<string>();
    @Input() SearchMode: EPoolSearchType = EPoolSearchType.every;
    @Output() SearchModeChange = new EventEmitter<EPoolSearchType>();
    @Output() OnRefreshRandom = new EventEmitter();


    constructor() {
    }

    ngOnInit(): void {
    }
}
