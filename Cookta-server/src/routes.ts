/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import {Controller, FieldErrors, TsoaRoute, ValidateError, ValidationService} from 'tsoa';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import {FoodController} from './controllers/food.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import {IngredientTypeController} from './controllers/ingredient-type.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import {UnitController} from './controllers/unit.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import {BaselistController} from './controllers/baselist.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import {TagController} from './controllers/tag.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import {StockController} from './controllers/stock.controller';
import {expressAuthentication} from './authentication';
import * as express from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "iIngredient": {
        "dataType": "refObject",
        "properties": {
            "ingredientID": { "dataType": "string", "required": true },
            "unit": { "dataType": "string", "required": true },
            "value": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Tag": {
        "dataType": "refObject",
        "properties": {
            "guid": {"dataType": "string", "required": true},
            "name": {"dataType": "string", "required": true},
            "parentId": {"dataType": "string", "required": true},
            "ischildonly": {"dataType": "boolean", "required": true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ForeignFood": {
        "dataType": "refObject",
        "properties": {
            "owner": {"dataType": "string", "required": true},
            "name": {"dataType": "string", "default": ""},
            "desc": {"dataType": "string", "default": ""},
            "published": {"dataType": "boolean", "default": false},
            "ingredients": {"dataType": "array", "array": {"ref": "iIngredient"}, "default": []},
            "uploaded": {"dataType": "double", "required": true},
            "dose": {"dataType": "double", "default": 4},
            "lastModified": {"dataType": "double", "required": true},
            "subscriptions": {"dataType": "double", "required": true},
            "id": {"dataType": "string"},
            "foodId": {"dataType": "string", "required": true},
            "tags": {"dataType": "array", "array": {"ref": "Tag"}, "required": true},
            "autoTags": {"dataType": "array", "array": {"ref": "Tag"}, "required": true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PersonalFood": {
        "dataType": "refObject",
        "properties": {
            "owner": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "default": "" },
            "desc": { "dataType": "string", "default": "" },
            "isPrivate": { "dataType": "boolean", "default": true },
            "published": { "dataType": "boolean", "default": false },
            "ingredients": { "dataType": "array", "array": { "ref": "iIngredient" }, "default": [] },
            "imageUploaded": { "dataType": "double", "required": true },
            "uploaded": { "dataType": "double", "required": true },
            "dose": { "dataType": "double", "default": 4 },
            "lastModified": { "dataType": "double", "required": true },
            "subscriptions": { "dataType": "double", "required": true },
            "id": { "dataType": "string" },
            "foodId": {"dataType": "string", "required": true},
            "tags": {"dataType": "array", "array": {"ref": "Tag"}, "required": true},
            "autoTags": {"dataType": "array", "array": {"ref": "Tag"}, "required": true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUpdateFoodRequest": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "desc": { "dataType": "string", "required": true },
            "isPrivate": { "dataType": "boolean", "required": true },
            "published": { "dataType": "boolean", "required": true },
            "ingredients": { "dataType": "array", "array": { "ref": "iIngredient" }, "required": true },
            "dose": { "dataType": "double", "required": true },
            "tags": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "foodId": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EUnitType": {
        "dataType": "refEnum",
        "enums": [0, 1, 2],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "iUnit": {
        "dataType": "refObject",
        "properties": {
            "type": { "ref": "EUnitType", "required": true },
            "name": { "dataType": "string", "required": true },
            "shortname": { "dataType": "string", "required": true },
            "tobase": { "dataType": "double", "required": true },
            "id": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IngredientType": {
        "dataType": "refObject",
        "properties": {
            "category": { "dataType": "string", "default": "Default" },
            "name": { "dataType": "string", "default": "UnitName" },
            "baseUnit": { "dataType": "string", "required": true },
            "volumeEnabled": { "dataType": "boolean", "required": true },
            "countEnabled": { "dataType": "boolean", "required": true },
            "massEnabled": { "dataType": "boolean", "required": true },
            "inshopping": { "dataType": "string", "required": true },
            "guid": { "dataType": "string", "required": true },
            "options": { "dataType": "nestedObjectLiteral", "nestedProperties": { "cunits": { "dataType": "array", "array": { "ref": "iUnit" }, "required": true } }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ISetIngredientTypeRequest": {
        "dataType": "refObject",
        "properties": {
            "category": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "baseUnit": { "dataType": "string", "required": true },
            "volumeEnabled": { "dataType": "boolean", "required": true },
            "countEnabled": { "dataType": "boolean", "required": true },
            "massEnabled": { "dataType": "boolean", "required": true },
            "inshopping": { "dataType": "string", "required": true },
            "options": { "dataType": "nestedObjectLiteral", "nestedProperties": { "cunits": { "dataType": "array", "array": { "ref": "iUnit" }, "required": true } }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Unit": {
        "dataType": "refObject",
        "properties": {
            "type": { "ref": "EUnitType", "required": true },
            "name": { "dataType": "string", "required": true },
            "shortname": { "dataType": "string", "required": true },
            "tobase": { "dataType": "double", "required": true },
            "id": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BaselistItem": {
        "dataType": "refObject",
        "properties": {
            "ingredientID": { "dataType": "string", "required": true },
            "unit": { "dataType": "string", "required": true },
            "value": { "dataType": "double", "required": true },
            "sub": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SetTagRequest": {
        "dataType": "refObject",
        "properties": {
            "guid": { "dataType": "string" },
            "name": { "dataType": "string", "required": true },
            "parent": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStockItem": {
        "dataType": "refObject",
        "properties": {
            "_id": { "dataType": "string" },
            "typeid": { "dataType": "string", "required": true },
            "type": { "dataType": "string", "required": true },
            "value": { "dataType": "double", "required": true },
            "unitId": { "dataType": "string", "required": true },
            "sub": { "dataType": "string" },
            "validitydate": { "dataType": "double" },
            "lastupdate": { "dataType": "double" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ISetStockItemRequest": {
        "dataType": "refObject",
        "properties": {
            "owner": { "dataType": "string", "required": true },
            "type": { "dataType": "string" },
            "typeId": { "dataType": "string", "required": true },
            "value": { "dataType": "double" },
            "unitId": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: express.Express) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    app.get('/food',
        authenticateMiddleware([{ "Bearer": ["test-permission"] }]),
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new FoodController();


            const promise = controller.GetFoods.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/food/:id',
        authenticateMiddleware([{"Bearer": []}]),
        function(request: any, response: any, next: any) {
            const args = {
                request: {"in": "request", "name": "request", "required": true, "dataType": "object"},
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new FoodController();


            const promise = controller.GetFoodById.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/food/:from/:count',
        authenticateMiddleware([{"Bearer": []}]),
        function(request: any, response: any, next: any) {
            const args = {
                request: {"in": "request", "name": "request", "required": true, "dataType": "object"},
                from: { "in": "path", "name": "from", "required": true, "dataType": "double" },
                count: { "in": "path", "name": "count", "required": true, "dataType": "double" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new FoodController();


            const promise = controller.GetPublicFoodsIncremental.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/food',
        authenticateMiddleware([{"Bearer": []}]),
        function(request: any, response: any, next: any) {
            const args = {
                updateFoodRequest: {
                    "in": "body",
                    "name": "updateFoodRequest",
                    "required": true,
                    "ref": "IUpdateFoodRequest"
                },
                request: {"in": "request", "name": "request", "required": true, "dataType": "object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new FoodController();


            const promise = controller.AddOrUpdateFood.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/food/:id',
        authenticateMiddleware([{"Bearer": []}]),
        function(request: any, response: any, next: any) {
            const args = {
                request: {"in": "request", "name": "request", "required": true, "dataType": "object"},
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new FoodController();


            const promise = controller.DeleteFood.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/ingredientType',
        function(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new IngredientTypeController();


            const promise = controller.GetAll.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/ingredientType',
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "body", "name": "request", "required": true, "ref": "ISetIngredientTypeRequest" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new IngredientTypeController();


            const promise = controller.SetIngredient.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/ingredientType/:guid',
        function(request: any, response: any, next: any) {
            const args = {
                guid: { "in": "path", "name": "guid", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new IngredientTypeController();


            const promise = controller.DeleteIngredient.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/unit',
        function(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new UnitController();


            const promise = controller.GetAll.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/Baselist/:owner',
        function(request: any, response: any, next: any) {
            const args = {
                owner: { "in": "path", "name": "owner", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new BaselistController();


            const promise = controller.GetAllByOwner.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/Baselist/:owner',
        function(request: any, response: any, next: any) {
            const args = {
                owner: { "in": "path", "name": "owner", "required": true, "dataType": "string" },
                data: { "in": "body", "name": "data", "required": true, "ref": "iIngredient" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new BaselistController();


            const promise = controller.SetListItem.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/tag',
        function(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new TagController();


            const promise = controller.GetAll.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/tag',
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "body", "name": "request", "required": true, "ref": "SetTagRequest" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new TagController();


            const promise = controller.SetTag.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/tag/:id',
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new TagController();


            const promise = controller.Delete.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/stock/:owner',
        function(request: any, response: any, next: any) {
            const args = {
                owner: { "in": "path", "name": "owner", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new StockController();


            const promise = controller.GetAll.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/stock/:owner',
        function(request: any, response: any, next: any) {
            const args = {
                setRequest: { "in": "body", "name": "setRequest", "required": true, "ref": "ISetStockItemRequest" },
                owner: { "in": "path", "name": "owner", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new StockController();


            const promise = controller.SetItem.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return (request: any, _response: any, next: any) => {
            let responded = 0;
            let success = false;

            const succeed = function(user: any) {
                if (!success) {
                    success = true;
                    responded++;
                    request['user'] = user;
                    next();
                }
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            const fail = function(error: any) {
                responded++;
                if (responded == security.length && !success) {
                    error.status = error.status || 401;
                    next(error)
                }
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    let promises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        promises.push(expressAuthentication(request, name, secMethod[name]));
                    }

                    Promise.all(promises)
                        .then((users) => { succeed(users[0]); })
                        .catch(fail);
                } else {
                    for (const name in secMethod) {
                        expressAuthentication(request, name, secMethod[name])
                            .then(succeed)
                            .catch(fail);
                    }
                }
            }
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode;
                if (isController(controllerObj)) {
                    const headers = controllerObj.getHeaders();
                    Object.keys(headers).forEach((name: string) => {
                        response.set(name, headers[name]);
                    });

                    statusCode = controllerObj.getStatus();
                }

                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                if (data || data === false) { // === false allows boolean result
                    response.status(statusCode || 200).json(data);
                } else {
                    response.status(statusCode || 204).end();
                }
            })
            .catch((error: any) => next(error));
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function getValidatedArgs(args: any, request: any): any[] {
        const fieldErrors: FieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "silently-remove-extras", "specVersion": 2 });
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "silently-remove-extras", "specVersion": 2 });
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "silently-remove-extras", "specVersion": 2 });
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, name + '.', { "noImplicitAdditionalProperties": "silently-remove-extras", "specVersion": 2 });
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', { "noImplicitAdditionalProperties": "silently-remove-extras", "specVersion": 2 });
            }
        });

        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
