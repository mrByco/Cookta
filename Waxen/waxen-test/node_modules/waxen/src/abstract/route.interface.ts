import { ERouteMethod } from "../route-method.enum";

export interface IRoute<RQ, RS, P> {
    path: string;
    method: ERouteMethod;
}