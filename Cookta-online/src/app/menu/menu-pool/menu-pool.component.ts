import {AfterViewInit, Component, ElementRef, EventEmitter, Input, ViewChild} from '@angular/core';
import * as ResizeDetector from 'element-resize-detector';
import {delay} from "rxjs/operators";


@Component({
    selector: 'app-menu-pool',
    templateUrl: './menu-pool.component.html',
    styleUrls: ['./menu-pool.component.css'],
})
export class MenuPoolComponent implements AfterViewInit {

    @Input('SelectedItem') public Selected: any;
    @Input('OnSelectionChanged') public OnSelectionChanged: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('ItemContainer') public ItemContainer: ElementRef;


    public SearchMode = false;
    public readonly MinItemSize = 150;
    public m_CalculatedVerticalMargin: number = 10;
    public readonly MinMargin = this.MinItemSize / 20;
    public Items: any[] = [];
    public ItemState;
    private m_ItemSize: number = 100;
    private RequestedItemCount: number = 50;
    private resizeDetector: any;

    constructor() {
    }

    public get ItemMarginVertical(){
        return this.m_CalculatedVerticalMargin;
    }

    public get ItemSize(): number {
        return this.m_ItemSize;
    }

    ngAfterViewInit(): void {
        this.ReCalcItemRequest();
        let getItems = async () => {
            await delay(0);
            this.ReloadItems(this.RequestedItemCount);
        }
        this.resizeDetector = ResizeDetector({strategy: "scroll"});
        this.resizeDetector.listenTo(this.ItemContainer.nativeElement, () => this.ReCalcItemRequest());
        getItems();
    }

    Changed($event: Event) {
        console.log($event);
    }

    RandomItems() {
        this.ReloadItems(this.RequestedItemCount);
    }

    private async ReloadItems(count: number) {
        let items = [];
        for (let i = 0; i < count; i++) {
            items.push({});
        }
        if (this.ItemState == 'in'){
            this.ItemState = 'void';
        }
        await new Promise(r => setTimeout(r, 600));
        this.Items = items;
        this.ItemState = 'in';
    }

    private ReCalcItemRequest() {
        let containerWidth = this.ItemContainer.nativeElement.offsetWidth;
        let containerHeight = this.ItemContainer.nativeElement.offsetHeight;
        let horizontalItemCount = Math.floor(containerWidth / (this.MinItemSize + 2 * this.MinMargin));
        let verticalItemCount = Math.floor(containerHeight / (this.MinItemSize + 2 * this.MinMargin));
        this.m_ItemSize = (containerWidth / horizontalItemCount) - (2 * this.MinMargin);
        this.m_CalculatedVerticalMargin = (containerHeight - (verticalItemCount * this.m_ItemSize)) / verticalItemCount / 2;
        this.RequestedItemCount = verticalItemCount * horizontalItemCount;
    }
}
