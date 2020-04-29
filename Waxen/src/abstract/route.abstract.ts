import { ERouteMethod } from "../route-method.enum";
import { ARouteExecutor } from "./route-executor.abstract";

export interface IRoute<RQ, RS, P> {
    exec?: ARouteExecutor<RQ, RS, P>;
    basepath: string;
    path: string;
    method: ERouteMethod;

}