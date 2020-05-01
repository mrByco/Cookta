import { IRoute } from "./route.interface";

export interface ControllerData {
    basepath: string,
    name: string,
    routes: IRoute<unknown, unknown, unknown>[],
}
