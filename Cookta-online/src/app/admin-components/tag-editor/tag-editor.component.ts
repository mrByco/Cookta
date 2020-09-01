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
  TreeItems: TreeviewItem[];

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
      checked: false,
    })
  }

  ngOnInit(): void {
  }

}
