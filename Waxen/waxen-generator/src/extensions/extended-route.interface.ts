import {IRoute} from "waxen/dist/abstract/route.interface";
import {EnumDeclaration} from "ts-morph";
import {ERouteMethod} from "waxen/dist/route-method.enum";

export interface IGeneratorRoute {
    routeName: string;
    path: string;
    method: ERouteMethod;

    requestTypeName: string;
    responseTypeName: string;
    paramTypeName: string;
    paramTypeOrder: { key: string, type: string }[];
    authentication?: {anoEnabled: boolean, permissions: string[]};
}
