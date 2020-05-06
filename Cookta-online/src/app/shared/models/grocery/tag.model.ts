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

  public static FromJson(d) {
    let tag = new Tag(
      d['guid'],
      d['name'],
      d['parentId'],
      d['ischildonly']
    );
    tag.displayName = () => {return tag.name};
    return tag;
  }
}
