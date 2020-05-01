import * as express from 'express';
import { ProcessPromiseResponse } from 'waxen/dist/server/request-promise-handler';
import { authenticationReqMiddleware } from 'waxen/dist/server/request-promise-handler';
import { defaultAuthentication } from "./authentication";
import { FoodController } from "../controllers/food.controller";
import { IUpdateFoodRequest } from "cookta-shared/src/contracts/foods/update-food.request";

export function RegisterRoutes(app: express.Express) {
    // <<=======-FOODCONTROLLER-======>>
    app.get('/food/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, true, [], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new FoodController();
                const promise = controller.GetPublicFoods(request.body as void, user);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.get('/food/:from/:count',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, true, [], (error) => { }).then((user) => {
                const args = {
                    from: request.params['from'],
                    count: request.params['count']
                };
                const controller = new FoodController();
                const promise = controller.GetPublicFoodsIncremental(request.body as void, user, args.from, args.count);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.get('/food/own/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new FoodController();
                const promise = controller.GetOwnFoods(request.body as void, user);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.get('/food/subscription/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new FoodController();
                const promise = controller.GetSubscriptionFoods(request.body as void, user);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.get('/food/family/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new FoodController();
                const promise = controller.GetFamilyFoods(request.body as void, user);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.get('/food/collection/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, true, [], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new FoodController();
                const promise = controller.GetCollectionFoods(request.body as void, user);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.get('/food/:id',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, true, [], (error) => { }).then((user) => {
                const args = {
                    id: request.params['id']
                };
                const controller = new FoodController();
                const promise = controller.GetFoodById(request.body as void, user, args.id);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.post('/food/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new FoodController();
                const promise = controller.AddOrUpdateFood(request.body as IUpdateFoodRequest, user);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.delete('/food/:foodId',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                    foodId: request.params['foodId']
                };
                const controller = new FoodController();
                const promise = controller.DeleteFood(request.body as void, user, args.foodId);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.post('/food/image/:foodVersionId',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                    foodVersionId: request.params['foodVersionId']
                };
                const controller = new FoodController();
                const promise = controller.UploadImage(request.body as void, user, request, args.foodVersionId);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.delete('/food/image/:foodVersionId',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                    foodVersionId: request.params['foodVersionId']
                };
                const controller = new FoodController();
                const promise = controller.DeleteImage(request.body as void, user, args.foodVersionId);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



}
