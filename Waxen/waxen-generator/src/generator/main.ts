import {ClassDeclaration, Project, ScriptTarget, SourceFile} from "ts-morph";
import {GenerateController, GenerateControllers} from "./sub-generators/controller-generator";
import {GetEndpointData, GetProject, MethodTypeRegister} from "./utility/utility";
import {ERouteMethod} from "waxen/dist/route-method.enum";
import { IGeneratorController } from "../extensions/generator-controller.interface";


export class Config {
    public static c: {
        routeDir?: string,
        authentication?: {
            "authenticationModule": string,
            "UserType": string,
        }
        apiDir?: string,
        authMethodName?: string}
}


export function InitWaxen(tsConfigPath: string): boolean {
    try {
        Config.c = require(process.cwd() + '/wconfig.json')
        if (Config.c.authentication){
            let project = GetProject(tsConfigPath);
            let authFile = project.getSourceFile(Config.c.authentication.authenticationModule);
            if (!authFile){
                console.log('Authentication module setting is not valid..');
                return true;
            }
            let exports = authFile.getFunctions();
            for (let exp of exports){
                let parameters = exp.getParameters();
                if (parameters.length != 3){
                    continue;
                }
                if (parameters[0].getType().getText() == 'any' &&
                    parameters[1].getType().getText() == 'boolean' &&
                    parameters[2].getType().getText() == 'string[]'){
                    Config.c.authMethodName = exp.getName();
                    break;
                }
            }
        }
        console.log(Config.c.authMethodName);
        return Config.c != undefined;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export function GetStatementsForController(controller: IGeneratorController): string[] {
    let statements: string[] = [`// <<=======-${controller.name.toUpperCase()}-======>>`];

    if (!controller.className){
        console.warn('WARNING: Controller "' + controller.name + '" not implemented!');
        return [];
    }

    for (let route of controller.routes){
        let paramsRoute: string = route.paramTypeOrder.map(p => `:${p.key}`).join('/');
        let fullPath: string = `/${controller.basepath}/${route.path}/${paramsRoute}`.split('//').join('/');
        statements.push(`app.${MethodTypeRegister(route.method)}('${fullPath}',`);
        statements.push('function(request: any, response: any, next: any) {')
        if (route.authentication && Config.c.authMethodName){
            statements.push(...[
                `authenticationReqMiddleware(${Config.c.authMethodName}, request, response, ${route.authentication.anoEnabled}, ${route.authentication.permissions.length > 0 ? `['${route.authentication.permissions.join("', '")}']` : '[]'}, (error) => {}).then((user) => {`
            ]);
        } else if (route.authentication){
            console.warn('Authentication not configured.')
        }
        statements.push('const args = {')
        for (let param of route.paramTypeOrder){
            if (route.paramTypeOrder.indexOf(param) == route.paramTypeOrder.length - 1){
                statements.push(`${param.key}: request.params['${param.key}']`);
            }else{
                statements.push(`${param.key}: request.params['${param.key}'],`);
            }
        };
        let userParam = route.authentication ? `, ${Config.c.authMethodName ? 'user' : 'undefined'}` : '';
        statements.push(...[
            '};\n',
            `const controller = new ${controller.className}();`,
            `const promise = controller.${route.routeName}(request.body as ${route.requestTypeName}${userParam}, ${route.provideRequest ? 'request, ' : ''}${route.paramTypeOrder.map(p => `args.${p.key}`).join(', ')});`,
            `ProcessPromiseResponse(controller, promise, response, next, (error) => {});`,
        ])
        if (route.authentication && Config.c.authMethodName){
            statements.push(...[
                '}).catch((error) => {',
                'console.error(error);',
                'error.stack = undefined;',
                'response.status(error.status || 401);',
                'next(error)',
                '});',
                '});\n\n\n\n'
            ]);
        }else {
            statements.push('});\n\n\n\n');
        }
    }
    return statements;
}


export function GenerateRouter(tsConfigPath: string, controllerData: IGeneratorController[]) {
    console.log('Generating router...');
    const project = GetProject(tsConfigPath);
    let file = project.createSourceFile(Config.c.routeDir ? Config.c.routeDir + '/router.ts' : './router.ts', {}, {overwrite: true});


    file.addStatements(["import * as express from 'express';"]);
    file.addStatements(["import {ProcessPromiseResponse} from 'waxen/dist/server/request-promise-handler';"]);
    file.addStatements(["import {authenticationReqMiddleware} from 'waxen/dist/server/request-promise-handler';"]);


    let registerStatements: string [] = [];
    controllerData.forEach(d => registerStatements.push(...GetStatementsForController(d)));

    file.addFunction({
        isExported: true,
        name: 'RegisterRoutes',
        statements: registerStatements,
        parameters: [{name: 'app', type: 'express.Express'}]
    })
    file.fixMissingImports();
    file.formatText();

    file.saveSync();
    project.saveSync();
}
