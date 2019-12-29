import { Component, OnInit } from '@angular/core';
import {Tag} from "../../../shared/models/grocery/tag.model";
import {TagService} from "../../../shared/services/tag.service";

@Component({
  selector: 'app-tag-adder',
  templateUrl: './tag-adder.component.html',
  styleUrls: ['./tag-adder.component.css']
})
export class TagAdderComponent implements OnInit {

  Done: boolean = true;
  public Tags: Tag[];

  constructor(private tagService: TagService)
  {
    tagService.Tags.then((tags) => { this.Tags = tags.filter(t =>  t.isChildOnly) });
  }

  ngOnInit() {
  }

  AddTag() {

  }
}
