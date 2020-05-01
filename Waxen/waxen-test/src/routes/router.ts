import * as express from 'express';
import { ProcessPromiseResponse } from 'waxen/dist/server/request-promise-handler';
import { authenticationReqMiddleware } from 'waxen/dist/server/request-promise-handler';
import { authenticate } from "../auth";
import { TodoController } from "../controllers/task.controller";

export function RegisterRoutes(app: express.Express) {
    // <<=======-TODOS-======>>
    app.get('/secured/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(authenticate, request, response, false, ['ok'], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new TodoController();
                const promise = controller.Secured(request.body as void, user);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.get('/fail/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(authenticate, request, response, false, ['fail'], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new TodoController();
                const promise = controller.Fail(request.body as { id: string, name: string }, user);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.get('/optional/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(authenticate, request, response, false, ['ok'], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new TodoController();
                const promise = controller.InternalFail(request.body as void, user);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



}
