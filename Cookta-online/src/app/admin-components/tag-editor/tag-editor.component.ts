import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material';
import {NestedTreeControl} from '@angular/cdk/tree';
import { TagService } from 'src/app/shared/services/tag.service';
import {Tag} from '../../shared/models/grocery/tag.model';
import {TreeviewItem} from 'ngx-treeview';


@Component({
  selector: 'app-tag-editor',
  templateUrl: './tag-editor.component.html',
  styleUrls: ['./tag-editor.component.css']
})
export class TagEditorComponent implements OnInit {
  Tags: any[] = [{
    name: "Tag",
    Children: []
  }];
  TreeItems: TreeviewItem[] = [new TreeviewItem({
    text: "IT",
    value: 9,
    children: [
      {
        text: "Programming",
        value: 91,
        children: [
          {
            text: "Frontend",
            value: 911,
            children: [
              { text: "Angular 1", value: 9111 },
              { text: "Angular 2", value: 9112 },
              { text: "ReactJS", value: 9113 },
            ],
          },
          {
            text: "Backend",
            value: 912,
            children: [
              { text: "C#", value: 9121 },
              { text: "Java", value: 9122 },
              { text: "Python", value: 9123, checked: false },
            ],
          },
        ],
      },
      {
        text: "Networking",
        value: 92,
        children: [
          { text: "Internet", value: 921 },
          { text: "Security", value: 922 },
        ],
      },
    ],
  })];

  constructor(public tagService: TagService) {
    tagService.LoadTags().then(t => {
      this.TreeItems = [];
      for (let tag of t.filter(t => !t.parentId)){
        this.TreeItems.push(this.GetTreeViewItem(tag))
      }
    });
  }

  private GetTreeViewItem(tag: Tag): TreeviewItem{
    return new TreeviewItem({
      text: tag.name,
      value: tag,
      children: tag.Children ? tag.Children.map(child => this.GetTreeViewItem(child)): [],
    })
  }

  ngOnInit(): void {
  }

}
