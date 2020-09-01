import {IRoute} from "waxen/dist/abstract/route.interface";
import {ERouteMethod} from "waxen/dist/route-method.enum";
import {ControllerData} from "waxen/dist/abstract/controller.interface";
import {ITag} from "../../models/tag/tag.interface";
import {SetTagRequest} from "./set.tag.request";

const GetAll: IRoute<void, ITag[], void> = {method: ERouteMethod.GET, path: 'tag'};
const SetTag: IRoute<SetTagRequest, ITag[], void> = {method: ERouteMethod.POST, path: 'tag'};
const Delete: IRoute<void, ITag[], { id: string }> = {method: ERouteMethod.DELETE, path: 'tag'};

export const TagControllerData: ControllerData = {
    basepath: "", name: "Tags", routes: [GetAll, SetTag, Delete]
}
