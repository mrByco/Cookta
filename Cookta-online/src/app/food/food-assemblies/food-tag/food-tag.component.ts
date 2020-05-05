import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Tag} from "../../../shared/models/grocery/tag.model";
import {TagService} from "../../../shared/services/tag.service";

@Component({
  selector: 'app-food-tag',
  templateUrl: './food-tag.component.html',
  styleUrls: ['./food-tag.component.css']
})
export class FoodTagComponent implements OnInit {

  @Input() public TagId: string;
  @Input() public EditMode: boolean = false;

  @Output() OnTagRemoveClick: EventEmitter<Tag> = new EventEmitter<Tag>();

  public Tag: Tag = new Tag(null, "Betöltés alatt", null, null);

  constructor(public tagService: TagService) {
  }

  ngOnInit() {
    this.Tag = this.tagService.GetTag(this.TagId);
  }

}
