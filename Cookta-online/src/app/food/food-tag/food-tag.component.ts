import {Component, Input, OnInit} from '@angular/core';
import {ITag} from "../../shared/models/grocery/tag.interface";
import {TagService} from "../../shared/services/tag.service";

@Component({
  selector: 'app-food-tag',
  templateUrl: './food-tag.component.html',
  styleUrls: ['./food-tag.component.css']
})
export class FoodTagComponent implements OnInit {

  @Input() public TagId: string;

  public Tag: ITag = {isChildOnly: null, guid: null, name: "Betöltés alatt", parentId: null};

  constructor(public tagService: TagService) { }

  ngOnInit() {
    this.tagService.GetTag(this.TagId).then(tag => {
      this.Tag = tag;
    });
  }
}
