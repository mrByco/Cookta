import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, ViewChild} from '@angular/core';
import * as ResizeDetector from 'element-resize-detector';
import {delay} from "rxjs/operators";
import {FoodService} from "../../shared/services/food.service";
import {IPoolItem} from "./pool-item-interface";
import {TagService} from "../../shared/services/tag.service";
import {EPoolSearchType} from "./pool-search-type-enum";
import {PoolItemAnimationService} from "./pool-animation-service";
import {ActivatedRoute, NavigationEnd, Params, Router} from "@angular/router";
import {Food} from "../../shared/models/grocery/food.model";
import {parseMappings} from "@angular/compiler-cli/ngcc/src/sourcemaps/source_file";


@Component({
    selector: 'app-menu-pool',
    templateUrl: './menu-pool.component.html',
    styleUrls: ['./menu-pool.component.css'],
    providers: [PoolItemAnimationService]
})
export class MenuPoolComponent implements AfterViewInit, OnDestroy {

    @Input('SelectedItem') public Selected: any;
    @Input('OnSelectionChanged') public OnSelectionChanged: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('ItemContainer') public ItemContainer: ElementRef;
    public readonly MinItemSize = 150;
    public m_CalculatedVerticalMargin: number = 10;
    public readonly MinMargin = this.MinItemSize / 20;
    public Items: IPoolItem[] = [];
    private m_SearchMode: boolean;
    private Searching: boolean;
    private m_SearchText: string = '';
    private m_SearchType: EPoolSearchType = EPoolSearchType.every;
    private cancelSearch: () => void;
    private readonly searchTime: number = 800;
    private m_ItemSize: number = 100;
    private RequestedItemCount: number = 50;
    private resizeDetector: any;
    private foodPool: IPoolItem[];
    private tagPool: IPoolItem[];
    private onPoolsFilled: () => void;
    private readonly tagPercentage = 15;

    private routeSubscription;

    constructor(public foodService: FoodService, public tagService: TagService, public animator: PoolItemAnimationService, private router: Router, activatedRoute: ActivatedRoute) {
        this.routeSubscription = router.events.subscribe(e => {
            if (e instanceof NavigationEnd) {
                let params = router.getCurrentNavigation().finalUrl.queryParams
                this.updateSearchByParams(params)
            }
        })
        this.FillPools().then(() => this.updateSearchByParams(activatedRoute.snapshot.queryParams));

    }

    public get SearchMode(): boolean {
        return this.m_SearchMode;
    }

    public set SearchMode(value) {
        //To avoid not necessary calculations
        if (this.m_SearchMode != value) {
            this.m_SearchMode = value;
            this.ReCalcItemRequest();
        }
    }

    public get SearchText(): string {
        return this.m_SearchText
    }

    public set SearchText(value) {
        //To avoid not necessary calculations
        if (value != this.m_SearchText){
            this.m_SearchText = value;
            this.DoSearch();
        }
    }

    public get SearchType(): EPoolSearchType {
        return this.m_SearchType
    }

    public set SearchType(value) {
        this.m_SearchType = value;
        this.DoSearch();
    }

    public get ItemMarginVertical() {
        return this.m_CalculatedVerticalMargin;
    }

    public get ItemSize(): number {
        return this.m_ItemSize;
    }

    trackByItem(index: number, el: IPoolItem): any {
        return el.original;
    }

    ngAfterViewInit(): void {
        this.ReCalcItemRequest();
        let getItems = async () => {
            await delay(0);
            if (!this.tagPool || this.foodPool)
                this.onPoolsFilled = this.RandomPick;
            else
                this.RandomPick();
        }
        this.resizeDetector = ResizeDetector({strategy: "scroll"});
        this.resizeDetector.listenTo(this.ItemContainer.nativeElement, () => this.ReCalcItemRequest());
        getItems();
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
    }

    public async RandomPick() {
        let count = this.RequestedItemCount;

        if (this.foodPool.length == 0) return;
        let items: IPoolItem[] = [];
        while (items.length < count) {
            let percentage = Math.floor(Math.random() * 100);
            let pool: IPoolItem[] = percentage <= this.tagPercentage ? this.tagPool : this.foodPool;
            let randomIndex = Math.floor(Math.random() * (pool.length - 1));
            if (!items.find(i => i.original == pool[randomIndex].original) || pool.length < count) {
                items.push(pool[randomIndex]);
            }
        }
        this.OnSelectionChanged.emit(undefined);
        if (this.Items.length > 0) {
            this.animator.Hide();
            await new Promise(r => setTimeout(r, 600));
            this.SearchMode = false;
            this.Items.splice(0, this.Items.length);
            //Time for *ngFor directive to remove the old items
            await new Promise(r => setTimeout(r, 10));
        }
        this.animator.Open();
        this.Items.push(...items);
    }

    private updateSearchByParams(params: Params) {
        switch (params?.search) {
            case 'tag':
                this.SearchType = EPoolSearchType.tags;
                break;
            case 'food':
                this.SearchType = EPoolSearchType.foods;
                break;
            case 'every':
                this.SearchType = EPoolSearchType.every;
                break;
            default:
                this.SearchType = EPoolSearchType.every;
                break;
        }
        this.SearchText = params?.text ? params['text'] : '';
    }

    private async DoSearch(): Promise<void> {
        if (!this.tagPool || !this.foodPool) return;
        if (!this.Searching) {
            this.Searching = true;
            this.animator.Hide();
            await new Promise(r => setTimeout(r, 800));
            this.Items = [];
            this.SearchMode = true;
        }
        if (!this.Searching) return;
        if (this.cancelSearch)
            this.cancelSearch();

        try {
            await new Promise((resolve, reject) => {
                this.cancelSearch = () => reject('canceled');
                setTimeout(resolve, this.searchTime);
            });
        } catch (error) {
            if (error.message != 'canceled')
                console.log(error);
            return;
        }

        let items: IPoolItem[] = []

        switch (this.SearchType) {
            case EPoolSearchType.every:
                items = [...this.foodPool.concat(this.tagPool)];
                break;
            case EPoolSearchType.tags:
                items = [...this.tagPool];
                break;
            case EPoolSearchType.foods:
                items = [...this.foodPool];
                break;
        }
        items = items.filter(i => i.displayName().toLowerCase().includes(this.SearchText.toLowerCase()));
        items = items.sort((s1, s2) => this.compareSearchText(s1.displayName(), s2.displayName(), this.SearchText))
        if (this.SearchType == EPoolSearchType.tags) {
            let tagSearchResults = this.foodPool
                .filter(f => (f.original as Food).AllTags.find(t => t.name == this.SearchText));
            items.push(...tagSearchResults);
        }
        this.Items.splice(0, this.Items.length);
        this.Items = items.slice(0, items.length < this.RequestedItemCount * 2 ? items.length : this.RequestedItemCount * 2);

        this.animator.Open();
        this.Searching = false;

        let typeText = 'every';
        switch (this.SearchType) {
            case EPoolSearchType.every:
                typeText = 'every';
                break;
            case EPoolSearchType.tags:
                typeText = 'tag';
                break;
            case EPoolSearchType.foods:
                typeText = 'food';
                break;
        }
        this.router.navigate(['calendar'], {queryParams: {search: typeText, text: this.SearchText}})
    }

    private compareSearchText(t1: string, t2: string, search: string): number {
        let t1Points = this.getMatchPoints(t1, search);
        let t2Points = this.getMatchPoints(t2, search);
        if (t1Points == t2Points) return 0;
        return t1Points > t2Points ? -1 : 1;

    }

    private getMatchPoints(str: string, search: string): number {
        let points = 0;
        if (str.startsWith(search)) {
            points += search.length * 3;
        }
        if (str.includes(search)) {
            points += search.length * 2;
        }
        return points;
    }

    private async FillPools() {
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
        if (!this.tagPool) {
            let tags = await this.tagService.LoadTags();
            this.tagPool = tags.map(t => {
                return {
                    original: t,
                    subtitle: "",
                    picture: "assets/tag-picture.png",
                    displayName(): string {
                        return t.displayName();
                    }
                }
            })
        }
        if (this.onPoolsFilled)
            this.onPoolsFilled()
    }

    private ReCalcItemRequest() {
        // -3 few correction (rows or something)
        let containerWidth = this.ItemContainer.nativeElement.offsetWidth - 3;
        containerWidth -= this.SearchMode ? 25 : 0;
        let containerHeight = this.ItemContainer.nativeElement.offsetHeight;
        let horizontalItemCount = Math.floor(containerWidth / (this.MinItemSize + 2 * this.MinMargin));
        this.m_ItemSize = (containerWidth / horizontalItemCount) - (2 * this.MinMargin);
        let verticalItemCount = Math.floor(containerHeight / (this.m_ItemSize + 2 * this.MinMargin));
        this.m_CalculatedVerticalMargin = (containerHeight - (verticalItemCount * this.m_ItemSize)) / verticalItemCount / 2;
        this.RequestedItemCount = verticalItemCount * horizontalItemCount;
    }
}
