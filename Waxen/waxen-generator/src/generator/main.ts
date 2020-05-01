import {ClassDeclaration, Project, ScriptTarget, SourceFile} from "ts-morph";
import {GenerateController} from "./sub-generators/controller-generator";
import {GetControllerData} from "./utility/utility";
import {ERouteMethod} from "waxen/dist/route-method.enum";
import { IGeneratorController } from "../extensions/generator-controller.interface";


export class Config {
    public static c: {
        routeDir?: string,
        authentication?: {
            "authenticationModule": string,
            "UserType": string,
        }
        authMethodName?: string}
}


const GetProject: (tsConfigPath?: string) => Project = (tsConfigPath?: string) => {
    return tsConfigPath ?
        new Project({tsConfigFilePath: tsConfigPath}) :
        new Project({
            compilerOptions: {
                target: ScriptTarget.ES5
            }
        })
}

function GetControllerFiles(files: SourceFile[]): ClassDeclaration[] {
    let classes = [];
    for (let file of files) {
        if (file.getClasses().length > 0)
            for (let c of file.getClasses()) {
                if (c.getDecorator('Controller')) {
                    classes.push(c);
                }
            }
    }
    return classes;
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

export function GenerateControllers(tsConfigPath: string): IGeneratorController[] {
    console.log(`Reading tsconfig at: ${tsConfigPath}`)
    const project = GetProject(tsConfigPath);
    let files = project.getSourceFiles();
    //TODO Check controller classes can not have the same name
    console.log('Controller files: ');
    let controllerClasses = GetControllerFiles(files);
    controllerClasses.forEach(c => console.log('   - ' + c.getName()));
    let controllerData: IGeneratorController[] = [];
    controllerClasses.forEach(c => controllerData.push(GenerateController(c, GetControllerData(c))));
    project.saveSync();
    return controllerData;
};

function MethodTypeRegister(type: ERouteMethod): string{
    switch (type){
        case ERouteMethod.GET:
            return 'get';
        case ERouteMethod.PUT:
            return 'put';
        case ERouteMethod.POST:
            return 'post';
        case ERouteMethod.DELETE:
            return 'delete';
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
                `authenticationReqMiddleware(${Config.c.authMethodName}, request, response, ${route.authentication.anoEnabled}, ['${route.authentication.permissions.join("', '")}'], (error) => {}).then((user) => {`
            ]);
        } else if (route.authentication){
            console.warn('Authentication not configured.')
        }
        statements.push('const args = {')
        for (let param of route.paramTypeOrder){
            if (route.paramTypeOrder.indexOf(param) == route.paramTypeOrder.length - 1){
                statements.push(`${param.key}: request.query['${param.key}']`);
            }else{
                statements.push(`${param.key}: request.query['${param.key}'],`);
            }
        };
        let userParam = route.authentication ? `, ${Config.c.authMethodName ? 'user' : 'undefined'}` : '';
        statements.push(...[
            '};\n',
            `const controller = new ${controller.className}();`,
            `const promise = controller.${route.routeName}(request.body as ${route.requestTypeName}${userParam}, ${route.paramTypeOrder.map(p => `args.${p.key}`).join(', ')});`,
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
