import {IGeneratorRoute} from "./extended-route.interface";

export interface IGeneratorController {
    routes: IGeneratorRoute[];
    basepath: string;
    name: string;
}
