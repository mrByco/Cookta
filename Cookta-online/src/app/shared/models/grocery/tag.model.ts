import {IDisplayable} from "../../../utilities/displayable";
import {ITag} from "../../../../../../Cookta-shared/src/models/tag/tag.interface";

export class Tag implements IDisplayable, ITag {
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


}
