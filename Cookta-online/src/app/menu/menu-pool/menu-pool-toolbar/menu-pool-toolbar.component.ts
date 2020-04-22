import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-menu-pool-toolbar',
    templateUrl: './menu-pool-toolbar.component.html',
    styleUrls: ['./menu-pool-toolbar.component.css']
})
export class MenuPoolToolbarComponent implements OnInit {


    @Input() switchModel: boolean;
    @Output() switchModelChange = new EventEmitter<boolean>();

    constructor() {
    }

    ngOnInit(): void {
    }

    OnSearchModeChanged(event: Event) {
        this.switchModelChange.emit(event.target['checked']);
    }
}
