import { IRoute } from "./route.interface";

export interface Controller {
    basepath: string,
    name: string,
    routes: IRoute<unknown, unknown, unknown>[],
}