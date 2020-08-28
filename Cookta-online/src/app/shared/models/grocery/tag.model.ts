import {IDisplayable} from "../../../utilities/displayable";
import {ITag} from "../../../../../../Cookta-shared/src/models/tag/tag.interface";

export class Tag implements IDisplayable, ITag {

  public Parent: Tag;
  public Children: Tag[];

  constructor (
    public guid: string,
    public name: string,
    public parentId: string,
    public ischildonly: boolean){
  }

  displayName(): string {
    return name;
  }

  public static FromITag(itag: ITag): Tag {
    return new Tag(itag.guid, itag.name, itag.parentId, itag.ischildonly);
  }

  public static BuildReferences(tagsReference: Tag[]){
    for (let tag of tagsReference){
      if (tag.parentId){
        let parent = tagsReference.find(f => f.guid == tag.parentId);
        tag.Parent = parent;
        if (!parent.Children) parent.Children = [tag];
        else parent.Children.push(tag);
      }
    }
  }
}
