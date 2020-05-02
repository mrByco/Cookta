import {IRoute} from "waxen/dist/abstract/route.interface";
import {ERouteMethod} from "waxen/dist/route-method.enum";
import {ControllerData} from "waxen/dist/abstract/controller.interface";

const Ping: IRoute<void, void, void> = {method: ERouteMethod.GET, path: ''};

export const PingControllerData: ControllerData = {
    basepath: "ping", name: "Ping", routes: [Ping]
}
