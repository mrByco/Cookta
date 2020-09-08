import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IDisplayable} from "../displayable";
import {EFormState} from "../form-state.enum";
import {BsDropdownDirective, MdbInputDirective} from "angular-bootstrap-md";
import Fuse from "fuse.js";

let numInstances = 0;


@Component({
    selector: 'app-auto-complete',
    templateUrl: './auto-complete.component.html',
    styleUrls: ['./auto-complete.component.css']
})
export class AutoCompleteComponent implements OnInit {


    public FormIdentity: string;


    @Output('OnItemChosen') public ItemChosen: EventEmitter<IDisplayable> = new EventEmitter<IDisplayable>();
    @Output('OnSelectedChanged') public SelectedChanged: EventEmitter<IDisplayable> = new EventEmitter<IDisplayable>();



    @Input() public set SuggestionPool(v) {
        let searchables: { item: any, text: string }[] = [];
        if (!v) v = [];
        console.log(v);

        if (this.isArrayOfStrings(v)) {
            searchables.push(...(v as string[]).map(i => {
                return {item: i, text: i}
            }))
        } else {
            searchables.push(...(v as IDisplayable[])
                ?.map(r => {
                    return {item: r, text: r.displayName()}
                })??[]);
        }

        const options = {
            includeScore: true,
            keys: ['text']
        }
        this.fuse = new Fuse(searchables, options)

        this.m_SuggestionPool = v;
    }
    public get SuggestionPool(){
        return this.m_SuggestionPool;
    };

    private m_SuggestionPool: IDisplayable[] | Promise<IDisplayable[]> | string[] = [];
    private fuse: Fuse<{ item: any, text: string }>;
    @Input() MaxItemsToShow: number = 15;
    @Input() PlaceholderText: string = "";
    @Input() MustMatchToPool: boolean = true;
    @Input() SuggestionsPrefix: string = "";

    @ViewChild('input', {static: true}) InputTextElement: MdbInputDirective;
    @ViewChild('dropdown', {static: true}) DropDown: BsDropdownDirective;
    @Input() Scroll: boolean = true;

    CurrentText: string;
    public state: EFormState;
    public Suggestions: IDisplayable[];
    private m_SelectedItem: IDisplayable;

    constructor() {
        this.FormIdentity = "AutoCompleteComponent" + numInstances++;
    }

    public get SelectedItem() {
        return this.m_SelectedItem;
    }

    public set SelectedItem(value: IDisplayable) {
        if (value != this.m_SelectedItem) {
            this.SelectedChanged.emit(value);
        }
        this.m_SelectedItem = value;
    }

    ngOnInit() {
    }

    OnFocus() {
        if (this.Suggestions && this.Suggestions.length > 0) {
            this.DropDown.show();
        }
    }

    UnFocus() {
        new Promise(resolve => {
            setTimeout(resolve, 200);
        }).then(() => {
            this.DropDown.hide();
        });
    }

    TextInput() {
        setTimeout(() => {
            let filtered = this.fuse.search(this.CurrentText).map(i => i.item.item, {limit: 2});

            this.Suggestions = filtered.slice(0, this.MaxItemsToShow);
            this.SelectedItem = filtered.find(item => item.displayName() == this.CurrentText);
            if (this.SelectedItem != null) {
                this.ItemChosen.emit(this.SelectedItem);
            }
            if (this.Suggestions.length > 0) {
                this.DropDown.show();
            } else {
                this.DropDown.hide();
            }
        }, 0);
    }

    public SelectItem(item: IDisplayable) {
        if (!item) {
            this.CurrentText = "";
            this.SelectedItem = undefined;
            this.ItemChosen.emit(undefined);
            return;
        }

        this.CurrentText = item.displayName();
        this.SelectedItem = item;
        this.ItemChosen.emit(item);
    }

    private isArrayOfStrings(value: any): boolean {
        return Array.isArray(value) && value.every(item => typeof item === "string");
    }

}
