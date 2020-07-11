import * as express from 'express';
import { ProcessPromiseResponse } from 'waxen/dist/server/request-promise-handler';
import { authenticationReqMiddleware } from 'waxen/dist/server/request-promise-handler';
import { defaultAuthentication } from "./authentication";
import { DayController } from "../controllers/static/day.controller";
import { IMealing } from "cookta-shared/src/models/days/mealing.interface";
import { EssentialsController } from "../controllers/static/essentialsController";
import { IIngredient } from "cookta-shared/src/models/ingredient/ingredient.interface";
import { FamilyController } from "../controllers/static/family.controller";
import { InviteFamilyRequest } from "cookta-shared/src/contracts/family/invite.family.request";
import { FoodController } from "../controllers/static/food.controller";
import { IUpdateFoodRequest } from "cookta-shared/src/contracts/foods/update-food.request";
import { HomeController } from "../controllers/static/home.controller";
import { IHomeContentRequest } from "cookta-shared/src/contracts/home/home-content.request";
import { IngredientTypeController } from "../controllers/static/ingredient-type.controller";
import { ISetIngredientTypeRequest } from "cookta-shared/src/contracts/ingredient-type/set.ingredient-type.request";
import { IDeleteIngredientTypeRequest } from "cookta-shared/src/contracts/ingredient-type/delete-ingredient-type";
import { DeleteCustomUnitRequest } from "cookta-shared/src/contracts/ingredient-type/delete-custom-unit";
import { PingController } from "../controllers/static/ping.controller";
import { ReportController } from "../controllers/static/report.controller";
import { ICreateReportRequest } from "cookta-shared/src/contracts/reports/create-report.request.interface";
import { ShoppingListController } from "../controllers/static/shopping-list.controller";
import { StockController } from "../controllers/static/stock.controller";
import { IStorageItemChangeRequest } from "cookta-shared/src/contracts/stock/StorageItemChange.request";
import { SubscriptionController } from "../controllers/static/subscription.controller";
import { TagController } from "../controllers/static/tag.controller";
import { SetTagRequest } from "cookta-shared/src/contracts/tags/set.tag.request";
import { UnitController } from "../controllers/static/unit.controller";
import { FixBadUnitRequest } from "cookta-shared/src/contracts/unit-route/get-bad-units";
import { RoleController } from "../controllers/static/role/role.controller";
import { IRole } from "cookta-shared/src/models/roles/role.interface";
import { UserController } from "../controllers/static/user/user.controller";

export function RegisterRoutes(app: express.Express) {
    // <<=======-DAYS-======>>
    app.get('/day/:date',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                    date: request.params['date']
                };
                const controller = new DayController();
                const promise = controller.GetDay(request.body as void, user, args.date);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.put('/day/:date',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                    date: request.params['date']
                };
                const controller = new DayController();
                const promise = controller.SetDay(request.body as IMealing[], user, args.date);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.get('/day/:date/:mealingIndex',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                    date: request.params['date'],
                    mealingIndex: request.params['mealingIndex']
                };
                const controller = new DayController();
                const promise = controller.RefreshMeal(request.body as void, user, args.date, args.mealingIndex);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.get('/day/finalize/:date/:mealingIdentity',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                    date: request.params['date'],
                    mealingIdentity: request.params['mealingIdentity']
                };
                const controller = new DayController();
                const promise = controller.FinalizeMealing(request.body as void, user, args.date, args.mealingIdentity);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    // <<=======-ESSENTIALS-======>>
    app.get('/baselist/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new EssentialsController();
                const promise = controller.GetCurrentBaseList(request.body as void, user,);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.post('/baselist/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new EssentialsController();
                const promise = controller.SetBaseList(request.body as IIngredient[], user,);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    // <<=======-FAMILIES-======>>
    app.get('/family/:familyId',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                    familyId: request.params['familyId']
                };
                const controller = new FamilyController();
                const promise = controller.GetFamily(request.body as void, user, args.familyId);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.put('/family/:newId',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                    newId: request.params['newId']
                };
                const controller = new FamilyController();
                const promise = controller.SwitchFamily(request.body as void, user, args.newId);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.delete('/family/:deleteId',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                    deleteId: request.params['deleteId']
                };
                const controller = new FamilyController();
                const promise = controller.DeleteFamily(request.body as void, user, args.deleteId);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.post('/family/:name',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                    name: request.params['name']
                };
                const controller = new FamilyController();
                const promise = controller.CreateFamily(request.body as void, user, args.name);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.put('/family/invite/:familyId',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                    familyId: request.params['familyId']
                };
                const controller = new FamilyController();
                const promise = controller.InviteByUserNameEmail(request.body as InviteFamilyRequest, user, args.familyId);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.delete('/family/leave/:familyId/:removeUserSub',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                    familyId: request.params['familyId'],
                    removeUserSub: request.params['removeUserSub']
                };
                const controller = new FamilyController();
                const promise = controller.LeaveFamily(request.body as void, user, args.familyId, args.removeUserSub);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    // <<=======-FOODCONTROLLER-======>>
    app.get('/food/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, true, [], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new FoodController();
                const promise = controller.GetPublicFoods(request.body as void, user,);
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
                const promise = controller.GetOwnFoods(request.body as void, user,);
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
                const promise = controller.GetSubscriptionFoods(request.body as void, user,);
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
                const promise = controller.GetFamilyFoods(request.body as void, user,);
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
                const promise = controller.GetCollectionFoods(request.body as void, user,);
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



    app.get('/food/page/:id/:count',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, true, [], (error) => { }).then((user) => {
                const args = {
                    id: request.params['id'],
                    count: request.params['count']
                };
                const controller = new FoodController();
                const promise = controller.GetFoodPageById(request.body as void, user, args.id, args.count);
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
                const promise = controller.AddOrUpdateFood(request.body as IUpdateFoodRequest, user,);
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



    app.get('/food/search/:text/:count',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, true, [], (error) => { }).then((user) => {
                const args = {
                    text: request.params['text'],
                    count: request.params['count']
                };
                const controller = new FoodController();
                const promise = controller.SearchFoods(request.body as void, user, args.text, args.count);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    // <<=======-HOME-======>>
    app.get('/home/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, true, [], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new HomeController();
                const promise = controller.GetHome(request.body as void, user,);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.put('/home/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, true, [], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new HomeController();
                const promise = controller.GetHomeContent(request.body as IHomeContentRequest[], user,);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    // <<=======-INGREDIENTTYPES-======>>
    app.get('/ingredientType/',
        function(request: any, response: any, next: any) {
            const args = {
            };
            const controller = new IngredientTypeController();
            const promise = controller.GetAll(request.body as void,);
            ProcessPromiseResponse(controller, promise, response, next, (error) => { });
        });



    app.post('/ingredientType/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, ['edit-ingredients'], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new IngredientTypeController();
                const promise = controller.SetIngredient(request.body as ISetIngredientTypeRequest, user,);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.delete('/ingredientType/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, ['delete-ingredients'], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new IngredientTypeController();
                const promise = controller.DeleteIngredient(request.body as IDeleteIngredientTypeRequest, user,);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.get('/ingredientType/check/:unitId',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, ['advanced-ingredients'], (error) => { }).then((user) => {
                const args = {
                    unitId: request.params['unitId']
                };
                const controller = new IngredientTypeController();
                const promise = controller.GetUnitRefs(request.body as void, user, args.unitId);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.put('/ingredientType/delete/unit/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, ['advanced-ingredients'], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new IngredientTypeController();
                const promise = controller.DeleteCustomUnit(request.body as DeleteCustomUnitRequest, user,);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    // <<=======-PING-======>>
    app.get('/ping/',
        function(request: any, response: any, next: any) {
            const args = {
            };
            const controller = new PingController();
            const promise = controller.Ping(request.body as void,);
            ProcessPromiseResponse(controller, promise, response, next, (error) => { });
        });



    // <<=======-REPORT-======>>
    app.get('/report/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, ['read-reports'], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new ReportController();
                const promise = controller.GetReports(request.body as void, user,);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.delete('/report/:id',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, ['manage-reports'], (error) => { }).then((user) => {
                const args = {
                    id: request.params['id']
                };
                const controller = new ReportController();
                const promise = controller.DeleteReport(request.body as void, user, args.id);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.get('/report/resolve/:id',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, ['manage-reports'], (error) => { }).then((user) => {
                const args = {
                    id: request.params['id']
                };
                const controller = new ReportController();
                const promise = controller.ResolveReport(request.body as void, user, args.id);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.post('/report/',
        function(request: any, response: any, next: any) {
            const args = {
            };
            const controller = new ReportController();
            const promise = controller.CreateReport(request.body as ICreateReportRequest,);
            ProcessPromiseResponse(controller, promise, response, next, (error) => { });
        });



    // <<=======-SHOPPINGLIST-======>>
    app.get('/ShoppingList/:nextShopping',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                    nextShopping: request.params['nextShopping']
                };
                const controller = new ShoppingListController();
                const promise = controller.GetShoppingList(request.body as void, user, args.nextShopping);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    // <<=======-STOCK-======>>
    app.get('/stock/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new StockController();
                const promise = controller.GetAll(request.body as void, user,);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.post('/stock/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new StockController();
                const promise = controller.CreateSection(request.body as void, user,);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.put('/stock/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new StockController();
                const promise = controller.EditSection(request.body as IStorageItemChangeRequest, user,);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.delete('/stock/:sectionIdString',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                    sectionIdString: request.params['sectionIdString']
                };
                const controller = new StockController();
                const promise = controller.DeleteSection(request.body as void, user, args.sectionIdString);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    // <<=======-SUBSCRIPTION-======>>
    app.get('/subscription/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new SubscriptionController();
                const promise = controller.GetSubscribedFoods(request.body as void, user,);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.put('/subscription/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new SubscriptionController();
                const promise = controller.SetSubscriptionState(request.body as { foodId: string, state: boolean }, user,);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    // <<=======-TAGS-======>>
    app.get('/tag/',
        function(request: any, response: any, next: any) {
            const args = {
            };
            const controller = new TagController();
            const promise = controller.GetAll(request.body as void,);
            ProcessPromiseResponse(controller, promise, response, next, (error) => { });
        });



    app.post('/tag/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, ['manage-tags'], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new TagController();
                const promise = controller.SetTag(request.body as SetTagRequest, user,);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.delete('/tag/:id',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, ['manage-tags'], (error) => { }).then((user) => {
                const args = {
                    id: request.params['id']
                };
                const controller = new TagController();
                const promise = controller.Delete(request.body as void, user, args.id);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    // <<=======-UNIT-======>>
    app.get('/unit/',
        function(request: any, response: any, next: any) {
            const args = {
            };
            const controller = new UnitController();
            const promise = controller.GetAll(request.body as void,);
            ProcessPromiseResponse(controller, promise, response, next, (error) => { });
        });



    app.get('/unit/bad-units/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, ['advanced-ingredients'], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new UnitController();
                const promise = controller.GetBadUnits(request.body as void, user,);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.post('/unit/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, ['advanced-ingredients'], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new UnitController();
                const promise = controller.FixBadUnit(request.body as FixBadUnitRequest, user,);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    // <<=======-ROLE-======>>
    app.get('/role/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, ['manage-roles'], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new RoleController();
                const promise = controller.GetRoles(request.body as void, user,);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.put('/role/',
        function(request: any, response: any, next: any) {
            const args = {
            };
            const controller = new RoleController();
            const promise = controller.SetRole(request.body as IRole,);
            ProcessPromiseResponse(controller, promise, response, next, (error) => { });
        });



    app.post('/role/',
        function(request: any, response: any, next: any) {
            const args = {
            };
            const controller = new RoleController();
            const promise = controller.CreateRole(request.body as IRole,);
            ProcessPromiseResponse(controller, promise, response, next, (error) => { });
        });



    app.delete('/role/:roleId/:changeRoleTo',
        function(request: any, response: any, next: any) {
            const args = {
                roleId: request.params['roleId'],
                changeRoleTo: request.params['changeRoleTo']
            };
            const controller = new RoleController();
            const promise = controller.DeleteRole(request.body as void, args.roleId, args.changeRoleTo);
            ProcessPromiseResponse(controller, promise, response, next, (error) => { });
        });



    // <<=======-USER-======>>
    app.get('/user/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new UserController();
                const promise = controller.User(request.body as void, user,);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.put('/user/:name',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                    name: request.params['name']
                };
                const controller = new UserController();
                const promise = controller.SetUserName(request.body as void, user, args.name);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.get('/user/:name',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                    name: request.params['name']
                };
                const controller = new UserController();
                const promise = controller.GetNameAlreadyUsed(request.body as void, user, args.name);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.get('/user/permission/:permission',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                    permission: request.params['permission']
                };
                const controller = new UserController();
                const promise = controller.HasPermission(request.body as void, user, args.permission);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.get('/user/manage/all/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, ['manage-users'], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new UserController();
                const promise = controller.GetAllUser(request.body as void, user,);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.put('/user/manage/editrole/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, ['manage-users'], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new UserController();
                const promise = controller.EditUser(request.body as { primarySub: string, roleId: string }, user,);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



    app.delete('/user/delete/',
        function(request: any, response: any, next: any) {
            authenticationReqMiddleware(defaultAuthentication, request, response, false, [], (error) => { }).then((user) => {
                const args = {
                };
                const controller = new UserController();
                const promise = controller.DeleteProfile(request.body as void, user,);
                ProcessPromiseResponse(controller, promise, response, next, (error) => { });
            }).catch((error) => {
                console.error(error);
                error.stack = undefined;
                response.status(error.status || 401);
                next(error)
            });
        });



}
