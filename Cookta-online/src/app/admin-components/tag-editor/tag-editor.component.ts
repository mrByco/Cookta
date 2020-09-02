import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTreeNestedDataSource} from '@angular/material';
import {NestedTreeControl} from '@angular/cdk/tree';
import {TagService} from 'src/app/shared/services/tag.service';
import {Tag} from '../../shared/models/grocery/tag.model';
import {TreeviewComponent, TreeviewItem} from 'ngx-treeview';


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

    @ViewChild("treeview") public NgxTreeView: TreeviewComponent;


    public SelectedTag: Tag;

    constructor(public tagService: TagService) {
        tagService.LoadTags().then(t => {
            this.TreeItems = [];
            for (let tag of t.filter(t => !t.parentId)) {
                this.TreeItems.push(this.GetTreeViewItem(tag))
            }
        });
    }

    private GetTreeViewItem(tag: Tag): TreeviewItem {
        return new TreeviewItem({
            text: tag.name,
            value: tag,
            children: tag.Children ? tag.Children.map(child => this.GetTreeViewItem(child)) : [],
            checked: false,
        })
    }

    ngOnInit(): void {
    }

    selectedChange(newSelected: Tag[]) {
        if (!newSelected || newSelected.length < 0) {
            this.SelectedTag = undefined;
            return;
        }

        //Get first not member parent tag
        let grandParent = undefined;
        let currentCheck = newSelected[0];
        console.log(newSelected)
        while (true) {
            console.log(currentCheck)
            if (currentCheck && currentCheck.Parent && !currentCheck.Parent.Children.find(t => !newSelected.includes(t))) {
                currentCheck = currentCheck.Parent;
            } else {
                this.SelectedTag = currentCheck;
                break;
            }
        }
        this.NgxTreeView.selection.checkedItems = [];
        let unselectItem = (item: TreeviewItem) => {
            item.checked = false;
            if (item.children)
                item.children.forEach(i => unselectItem(i));
        }
        this.NgxTreeView.items.forEach(i => unselectItem(i));
    }
}
