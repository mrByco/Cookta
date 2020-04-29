import { ERouteMethod } from "../../route-method.enum";
import { IRoute } from "../../abstract/route.abstract";
const base = 'Tasks';

const GetTask: IRoute<void, {id: string}, {id: string}> = {basepath: base, path: 'task', method: ERouteMethod.GET};


export const TaskRoute = {
    GetTask: GetTask,
}


function asd() {
    console.log(Object.keys(typeof(GetTask)));
    Object.keys(typeof(GetTask)).forEach(k => console.log(typeof(GetTask)[k]));
}
asd();