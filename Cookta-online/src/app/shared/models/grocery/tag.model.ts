import {IDisplayable} from "../../../utilities/displayable";

export class Tag implements IDisplayable {
  constructor (
    public guid: string,
    public name: string,
    public parentId: string,
    public isChildOnly: boolean){
  }

  displayName(): string {
    return name;
  }

  public static FromJson(d) {
    let tag = new Tag(
      d['guid'],
      d['name'],
      d['parentId'],
      d['isChildOnly']
    );
    tag.displayName = () => {return tag.name};
    return tag;
  }
}
