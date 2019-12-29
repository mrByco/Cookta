import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IDisplayable} from "../displayable";
import {EFormState} from "../form-state.enum";
import {BsDropdownDirective, MdbInputDirective} from "angular-bootstrap-md";
import {delay} from "rxjs/operators";

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


  @Input() SuggestionPool: IDisplayable[] | Promise<IDisplayable[]> = [];
  @Input() MaxItemsToShow: number = 10;
  @Input() PlaceholderText: string = "";

  @ViewChild('input', {static: true}) InputTextElement: MdbInputDirective;
  @ViewChild('dropdown', {static: true}) DropDown: BsDropdownDirective;

  CurrentText: string;

  public get SelectedItem(){
    return this.m_SelectedItem;
  }
  public set SelectedItem(value: IDisplayable){
    if (value != this.m_SelectedItem){
      this.SelectedChanged.emit(value);
    }
    this.m_SelectedItem = value;
  }
  private m_SelectedItem: IDisplayable;

  public state: EFormState;
  public Suggestions: IDisplayable[];

  constructor()
  {
    this.FormIdentity = "AutoCompleteComponent" + numInstances++;
  }

  ngOnInit() {
  }

  OnFocus() {
    this.DropDown.show();
  }

  UnFocus() {
     new Promise(resolve => {
       setTimeout(resolve, 200);
     }).then(() => {
       this.DropDown.hide();
     });
  }

  async TextInput() {

    let filtered = (await this.SuggestionPool).filter((sugg) => sugg.displayName().toLowerCase().includes(this.CurrentText.toLowerCase()));
    this.Suggestions = filtered.slice(0, this.MaxItemsToShow);
    this.SelectedItem = filtered.find(item => item.displayName() == this.CurrentText);
    if (this.SelectedItem != null){
      this.ItemChosen.emit(this.SelectedItem);
    }
  }

  public SelectItem(item: IDisplayable){
    this.CurrentText = item.displayName();
    this.SelectedItem = item;
    this.ItemChosen.emit(item);
  }

}
