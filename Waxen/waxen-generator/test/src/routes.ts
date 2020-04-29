import { IRoute } from "waxen/dist/abstract/route.interface"
import { ERouteMethod } from "waxen/dist/route-method.enum";
import { Controller } from "waxen/dist/abstract/controller.interface";

const GetTodos: IRoute<void, { id: string, name: string }, void> = { path: '', method: ERouteMethod.GET }
const SetTodo: IRoute<{ id: string, name: string }, { id: string, name: string }, void> = {  path: '', method: ERouteMethod.POST }

const Todos: Controller = {name: "Todos", basepath: 'todo', routes: [GetTodos, SetTodo]}

export const Routes = {
    Todos: name,
}