import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import {Food} from '../../../shared/models/grocery/food.model';
import * as ResizeDetector from 'element-resize-detector';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss']
})
export class FoodListComponent implements AfterViewInit {

  public FoodsToDisplay: Food[] = [];
  @Input('Expand') public Expand: boolean;
  public resizeDetector: any;
  @Input('MinItemSize') public MinItemSize: number = 260;
  public readonly MinMargin = this.MinItemSize / 40;
  public RequestedItemCount: number;
  @ViewChild('Container') public FoodContainer: ElementRef;
  @Output('OnRequiredNumberChanged') public OnRequiredNumberChanged: EventEmitter<number> = new EventEmitter<number>();
  private m_Foods: Food[] = [];
  private m_ItemWidth: number;
  private m_CalculatedVerticalMargin: number;

  constructor() {
  }

  public get Foods() {
    return this.m_Foods;
  }

  @Input('Foods')
  public set Foods(value) {
    this.m_Foods = value;
    this.RefreshDisplayFoods();
    console.log(this);
  }

  public get ItemWidth() {
    return this.m_ItemWidth;
  }

  public get ItemHeight() {
    return this.m_ItemWidth + 45;
  }

  public get VerticalMargin() {
    return this.m_CalculatedVerticalMargin;
  }

  ngAfterViewInit(): void {
    this.ReCalcItemRequest();
    this.resizeDetector = ResizeDetector();
    this.resizeDetector.listenTo(this.FoodContainer.nativeElement, () => this.ReCalcItemRequest());
  }

  private ReCalcItemRequest() {
    // -3 few correction (rows or something)
    let containerWidth = this.FoodContainer.nativeElement.offsetWidth;
    let containerHeight = this.FoodContainer.nativeElement.offsetHeight;
    let horizontalItemCount = Math.floor(containerWidth / (this.MinItemSize + 2 * this.MinMargin));
    this.m_ItemWidth = (containerWidth / horizontalItemCount) - (2 * this.MinMargin);
    if (this.Expand) {
      this.RequestedItemCount = -1;
      this.m_CalculatedVerticalMargin = this.MinMargin * 2;
      return;
    }
    let verticalItemCount = Math.floor(containerHeight / (this.ItemHeight + 2 * this.MinMargin));
    this.m_CalculatedVerticalMargin = (containerHeight - (verticalItemCount * this.ItemHeight)) / verticalItemCount / 2;
    this.RequestedItemCount = verticalItemCount * horizontalItemCount;
    this.RefreshDisplayFoods();
  }

  private RefreshDisplayFoods() {
    if (!this.Foods) return;
    setTimeout(() => {
      if (this.Expand) {
        this.FoodsToDisplay = this.Foods;
        return;
      }
      this.FoodsToDisplay = this.Foods.length > this.RequestedItemCount ? [...this.Foods.slice(0, this.RequestedItemCount)] : [...this.Foods];
    }, 0);
  }
}
