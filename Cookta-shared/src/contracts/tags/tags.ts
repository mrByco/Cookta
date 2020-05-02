import {IRoute} from "waxen/dist/abstract/route.interface";
import {ERouteMethod} from "waxen/dist/route-method.enum";
import {ControllerData} from "waxen/dist/abstract/controller.interface";
import {ITag} from "../../models/tag/tag.interface";
import {SetTagRequest} from "./set.tag.request";

const GetAll: IRoute<void, ITag[], void> = {method: ERouteMethod.GET, path: ''};
const SetTag: IRoute<SetTagRequest, ITag[], void> = {method: ERouteMethod.POST, path: ''};
const Delete: IRoute<void, ITag[], { id: string }> = {method: ERouteMethod.DELETE, path: ''};

export const TagControllerData: ControllerData = {
    basepath: "tag", name: "Tags", routes: [GetAll, SetTag, Delete]
}
