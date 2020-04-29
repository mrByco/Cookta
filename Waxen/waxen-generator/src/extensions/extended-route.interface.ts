import {IRoute} from "waxen/dist/abstract/route.interface";
import {EnumDeclaration} from "ts-morph";

export interface ExtendedIRoute<RQ, RS, P> extends IRoute<RQ, RS, P> {
    paramDeclaration: EnumDeclaration;
}
