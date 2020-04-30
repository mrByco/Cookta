import { IRoute } from "waxen/dist/abstract/route.interface"
import { ERouteMethod } from "waxen/dist/route-method.enum";
import {SampleResponse} from "./response.interface";
import { ControllerData } from "waxen/dist/abstract/controller.interface";


const GetTodos: IRoute< void, { id: string, name: string }, undefined> = { path: 'asd', method: ERouteMethod.GET }
const SetTodo: IRoute<{ id  :  string, name:   string    }, SampleResponse, number> = {  path: '', method: ERouteMethod.POST }

const Todos: ControllerData = {name: "Todos", basepath: 'todo', routes: [GetTodos, SetTodo]}

export const Routes = {
    todos: Todos,
}
