import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {delay} from "rxjs/operators";
import * as ResizeDetector from 'element-resize-detector';

@Component({
  selector: 'app-menu-pool',
  templateUrl: './menu-pool.component.html',
  styleUrls: ['./menu-pool.component.css']
})
export class MenuPoolComponent implements AfterViewInit {

  @Input('SelectedItem') public Selected: any;
  @Input('OnSelectionChanged') public OnSelectionChanged: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('ItemContainer') public ItemContainer: ElementRef;



  public readonly MinItemSize = 150;
  public readonly ItemMargin = this.MinItemSize / 20;
  public get ItemSize(): number {
    return this.m_ItemSize;
  }
  private m_ItemSize: number = 100;

  public SearchMode = false;

  public Items: any[] = [];
  private RequestedItemCount: number = 50;

  private resizeDetector: any

  constructor() {
  }

  ngAfterViewInit(): void {
    this.ReCalcItemRequest();
    let getItems = async () => {
      await delay(0);
      this.Items = this.GetItems(this.RequestedItemCount);
    }
    this.resizeDetector = ResizeDetector({strategy: "scroll"});
    this.resizeDetector.listenTo(this.ItemContainer.nativeElement, () => this.ReCalcItemRequest());
    getItems();
  }

  private GetItems(count: number){
    let items = [];
    for (let i = 0; i < count; i++){
      items.push({});
    }
    return items;
  }

  private ReCalcItemRequest(){
    let containerWidth = this.ItemContainer.nativeElement.offsetWidth;
    let containerHeight = this.ItemContainer.nativeElement.offsetHeight;
    let horizontalItemCount = Math.floor(containerWidth / (this.MinItemSize + 2 * this.ItemMargin));
    this.m_ItemSize = (containerWidth / horizontalItemCount) - (2 * this.ItemMargin) - 1;
    console.log(containerWidth);
    console.log(horizontalItemCount);
    console.log(this.m_ItemSize);
  }


  Changed($event: Event) {
    console.log($event);
  }
}
