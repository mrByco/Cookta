import {ClassDeclaration, Scope, StringLiteral} from "ts-morph";
import {IGeneratorController} from "../../extensions/generator-controller.interface";
import {IGeneratorRoute} from "../../extensions/extended-route.interface";
import {cleanStr} from "../utility/utility";
import {ADDRCONFIG} from "dns";
import {Config} from "../main";


function GenerateRouteFunctions(controllerInfo: IGeneratorController, controller: ClassDeclaration) {
    controllerInfo.className = controller.getName();
    for (let routeInfo of controllerInfo.routes) {
        let method = controller.getMethod(routeInfo.routeName);

        let authDecorator = method?.getDecorator('Security')
        if (authDecorator) {
            let anoEnabled = authDecorator.getArguments()[0].getText() == 'true';
            let permissions: string[] = [];
            let current = 1;
            while (current < authDecorator.getArguments().length) {
                permissions.push(cleanStr(authDecorator.getArguments()[current].getText()));
                current++;
            }
            routeInfo.authentication = {anoEnabled: anoEnabled, permissions: permissions};
        };

        let parameters = [
            {name: 'reqBody', type: routeInfo.requestTypeName}]
            .concat(routeInfo.authentication ?
                {name: 'user', type: Config.c.authentication?.UserType ? Config.c.authentication?.UserType : 'any'} :
                [])
            .concat(routeInfo.paramTypeOrder.map((p) => {
                return {name: p.key, type: p.type}
            }));
        let returnType = 'Promise<' + routeInfo.responseTypeName + '>';

        if (!method) {
            controller.addMethod({
                isAbstract: false,
                docs: ['TODO This method is auto generated by waxen generator. Please end it.'],
                isAsync: true,
                name: routeInfo.routeName,
                statements: [`throw new Error('Route ${routeInfo.routeName} is not implemented');`],
                parameters: parameters,
                returnType: returnType,
                scope: Scope.Public
            });
        } else {
            method.setIsAbstract(false);
            method.setIsAsync(true);
            method.getParameters().forEach(p => p.remove());
            method.addParameters(parameters);
            method.setReturnType(returnType);
            method.setScope(Scope.Public);
        }

    }
}

export function GenerateController(controller: ClassDeclaration, controllerInfo: IGeneratorController): IGeneratorController {
    console.log('Generating ' + controller.getName() + '....');
    try {
        GenerateRouteFunctions(controllerInfo, controller);
        controller.formatText();
        controller.getSourceFile().fixMissingImports();
        controller.getSourceFile().saveSync();
        return controllerInfo;
    } catch (error) {
        console.error(error);
        console.log(controller.getName() + ' could not be generated.');
    }
}
