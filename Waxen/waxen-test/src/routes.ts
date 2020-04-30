import {IRoute} from "waxen/dist/abstract/route.interface"
import {ERouteMethod} from "waxen/dist/route-method.enum";
import {ControllerData} from "waxen/dist/abstract/controller.interface";


const GetTodos: IRoute<void, { id: string, name: string }, {}> = {path: 'asd', method: ERouteMethod.GET}
const SetTodo: IRoute<{ id: string, name: string }, number, { firstParam: string, secondNumber: number }> = {
    path: '',
    method: ERouteMethod.POST
}
const DeleteTodo: IRoute<{}, { deleted: {id: string}}, {deleteId: string}> = {
    path: '',
    method: ERouteMethod.DELETE
}

const Todos: ControllerData = {name: "Todos", basepath: 'todo', routes: [GetTodos, SetTodo, DeleteTodo]}

export const Routes = {
    todos: Todos,
}
