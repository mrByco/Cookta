import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Tag} from "../../../shared/models/grocery/tag.model";
import {TagService} from "../../../shared/services/tag.service";
import {IDisplayable} from "../../../utilities/displayable";
import {AutoCompleteComponent} from "../../../utilities/auto-complete/auto-complete.component";

@Component({
  selector: 'app-tag-adder',
  templateUrl: './tag-adder.component.html',
  styleUrls: ['./tag-adder.component.css']
})
export class TagAdderComponent implements OnInit {

  public Done: boolean = false;
  public Tags: Tag[];

  @Output() public OnTagAdded: EventEmitter<Tag> = new EventEmitter<Tag>();

  @ViewChild("autoSugg", {static: true}) public AutoCompleteComponent: AutoCompleteComponent;

  private CurrentTag: Tag;

  constructor(private tagService: TagService)
  {
    tagService.TagsAsync.then((tags) => { this.Tags = tags.filter(t =>  t.ischildonly) });
  }

  ngOnInit() {

  }

  AddTag() {
    this.OnTagAdded.emit(this.CurrentTag);
    this.AutoCompleteComponent.SelectedItem = null;
    this.AutoCompleteComponent.CurrentText = "";
  }

  TagSelected(item: IDisplayable) {
    this.Done = item != undefined;
    this.CurrentTag = item as Tag;
  }
}
