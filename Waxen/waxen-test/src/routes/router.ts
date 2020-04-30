import * as express from 'express';
import { ProcessPromiseResponse } from 'waxen/dist/server/request-promise-handler';
import { TodoController } from "../controllers/task.controller";

export function RegisterRoutes(app: express.Express) {
    // <<=======-TODOS-======>>
    app.get('/todo/asd/',
        function(request: any, response: any, next: any) {
            const args = {
            };
            const controller = new TodoController();
            const promise = controller.GetTodos(request.body as void);
            ProcessPromiseResponse(controller, promise, response, next);
        });

    app.post('/todo/:firstParam/:secondNumber',
        function(request: any, response: any, next: any) {
            const args = {
                firstParam: request.query['firstParam'],
                secondNumber: request.query['secondNumber']
            };
            const controller = new TodoController();
            const promise = controller.SetTodo(request.body as { id: string, name: string }, args.firstParam, args.secondNumber);
            ProcessPromiseResponse(controller, promise, response, next);
        });

    app.delete('/todo/:deleteId',
        function(request: any, response: any, next: any) {
            const args = {
                deleteId: request.query['deleteId']
            };
            const controller = new TodoController();
            const promise = controller.DeleteTodo(request.body as {}, args.deleteId);
            ProcessPromiseResponse(controller, promise, response, next);
        });

}
