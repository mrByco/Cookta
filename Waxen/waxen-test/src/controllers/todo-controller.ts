import { Controller } from "waxen/dist/deorators/controller";
import {Routes} from "../routes";

export class TaskController {
    /** TODO This method is auto generated by waxen generator. Please end it. */
    public async GetTodos(reqBody: void): Promise<{ id: string, name: string }> {
        throw new Error('Route GetTodos is not implemented');
    }

    /** TODO This method is auto generated by waxen generator. Please end it. */
    public async SetTodo(reqBody: { id: string, name: string }, firstParam: string, secondNumber: number): Promise<number> {
        throw new Error('Route SetTodo is not implemented');
    }

    /** TODO This method is auto generated by waxen generator. Please end it. */
    public async DeleteTodo(reqBody: {}, deleteId: string): Promise<{ deleted: { id: string } }> {
        throw new Error('Route DeleteTodo is not implemented');
    }
}
