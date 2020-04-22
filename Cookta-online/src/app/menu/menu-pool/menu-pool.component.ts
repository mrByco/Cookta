import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import * as ResizeDetector from 'element-resize-detector';
import {delay} from "rxjs/operators";
import {Food} from "../../shared/models/grocery/food.model";
import {ISendableFood} from "../../shared/models/grocery/food.isendable.interface";
import {FoodService} from "../../shared/services/food.service";
import {DisplayMeal} from "../menu-editor/menu-editor.component";
import {IDisplayable} from "../../utilities/displayable";
import {IPoolItem} from "./pool-item-interface";




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
    public Items: IPoolItem[] = [];
    public ItemState;
    private m_ItemSize: number = 100;
    private RequestedItemCount: number = 50;
    private resizeDetector: any;
    private foodPool: IPoolItem[];
    private tagPool: IPoolItem[];
    private readonly tagPercentage = 15;

    constructor(public foodService: FoodService) {
    }

    public get ItemMarginVertical() {
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


    RandomItems() {
        this.ReloadItems(this.RequestedItemCount);
    }

    private async ReloadItems(count: number) {
        if (!this.foodPool) {
            let foods = await this.foodService.GetCollection();
            this.foodPool = foods.map(f => {
                return {
                    original: f,
                    subtitle: "",
                    picture: f.ImageUrl,
                    displayName(): string {
                        return f.name;
                    }
                }
            })
        }

        if (this.foodPool.length == 0) return;
        let items = [];
        let indexes = [];
        while (indexes.length < count) {
            let randomIndex = Math.floor(Math.random() * (this.foodPool.length - 1));
            if (!indexes.includes(randomIndex) || this.foodPool.length < count) {
                indexes.push(randomIndex);
            }
        }
        for (let i of indexes) {
            items.push(this.foodPool[i]);
        }
        this.ItemState = 'void';
        this.OnSelectionChanged.emit(undefined);
        await new Promise(r => setTimeout(r, 600));
        this.Items.splice(0, this.Items.length);
        this.ItemState = 'in';
        this.Items.push(...items);
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
