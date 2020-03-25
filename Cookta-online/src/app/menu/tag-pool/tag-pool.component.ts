import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {Food} from "../../shared/models/grocery/food.model";
import {FoodService} from "../../shared/services/food.service";
import {Tag} from "../../shared/models/grocery/tag.model";
import {TagService} from "../../shared/services/tag.service";

@Component({
  selector: 'app-tag-pool',
  templateUrl: './tag-pool.component.html',
  styleUrls: ['./tag-pool.component.css']
})
export class TagPoolComponent implements OnInit {

  public Tags: Tag[];
  public Selected: Tag;

  @Input() public SelectItemOut: (item: any) => void = this.SelectItem;
  @Input() public OnSelectionChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor(public tagService: TagService) {
    tagService.LoadTags().then(tags => this.Tags = tags);
  }

  ngOnInit() {
    this.OnSelectionChanged.subscribe(i => this.Selected = i);
  }

  GetItemSelected(item: any): boolean {
    return this.Selected === item;
  }

  SelectItem(item: Tag): void {
    if (this.GetItemSelected(item))
      this.OnSelectionChanged.emit(null);
    else
      this.OnSelectionChanged.emit(item);
  }

}
