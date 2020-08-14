import {
    ArrayLiteralExpression,
    ClassDeclaration, EnumMember, Identifier, ObjectLiteralExpression, Project,
    PropertyAccessExpression,
    PropertyAssignment, ScriptTarget,
    SyntaxList,
    TypeLiteralNode,
    VariableDeclaration
} from "ts-morph";
import {IGeneratorRoute} from "../../extensions/extended-route.interface";
import {ERouteMethod} from "waxen/dist/route-method.enum";

export function cleanStr(str: string): string {
    return str.split("'").join('').split('"').join('');
}


export function MethodTypeRegister(type: ERouteMethod): string{
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


export function GetProject(tsConfigPath?: string): Project {
    return tsConfigPath ?
        new Project({tsConfigFilePath: tsConfigPath}) :
        new Project({
            compilerOptions: {
                target: ScriptTarget.ES5
            }
        })
}

function KindToTypeString(node: any): string | null {
    //if type or array
    if (node instanceof TypeLiteralNode || node.getKind() == 174) {
        return node.getText();
    }
    if (node.getKind() == 110 || node.getKind() == 100 || node.getKind() == 146) {
        return 'void';
    }
    if (node.getKind() == 143) {
        return 'string';
    }
    if (node.getKind() == 140) {
        return 'number';
    }
    if (node.getKind() == 169) {
        return node.getText();
    }
    if (node.getKind() == 27) {
        //Ignore colons
        return null;
    }
    console.error('Unknown kind: ' + node.getKind());
    console.log('Using text: ' + node.getText());
    return node.getText();
}

function GetTypeParameters(statement: VariableDeclaration): string[] {
    let types = [];
    //+1 ve have pluss one child in the beginning
    let syntaxList = statement.getChildAtIndex(2).getChildAtIndex(2) as SyntaxList;
    syntaxList.getChildren().forEach(t => {
        if (KindToTypeString(t))
            types.push(KindToTypeString(t));
    });
    return types;
}

function ParamDefListFromLast(statement: VariableDeclaration): { key: string, type: string }[] {
    let syntaxList = statement.getChildAtIndex(2).getChildAtIndex(2) as SyntaxList;
    let t = syntaxList.getLastChild()
    let items: { key: string, type: string }[] = [];
    if (t instanceof TypeLiteralNode) {
        (t as TypeLiteralNode).getProperties().forEach(p => {
            let key = p.getChildAtIndex(0).getText();
            let type = KindToTypeString(p.getChildAtIndex(2));
            if (type != 'number' && type != 'string') {
                throw new Error('Cannot use type: "' + type + '" in a route parameter')
            }
            items.push({key: key, type: type});
        })
    } else if (KindToTypeString(t) == 'void'){
        return [];
    }
    else {
        console.error('Cannot read parameters from:', t.getText(), '\nSingle empty list..');
        console.warn("It need to be a type object like: {firstParam: string, secondNumber: number} or void");
    }
    return items;
}


export function GetEndpointData(controller: ClassDeclaration, endPointDecorator: string = 'Controller') {
    let firstArg: PropertyAccessExpression = controller.getDecorator(endPointDecorator)?.getArguments()[0] as PropertyAccessExpression;
    //Get the Controller data
    let propertyAssignment = firstArg.getSymbol().getValueDeclaration() as PropertyAssignment;
    controller.getProject().addSourceFilesAtPaths(propertyAssignment.getSourceFile().getDirectoryPath() + '/**/*.ts');

    let definition = (propertyAssignment.getInitializer() as Identifier).getDefinitions()[0].getDeclarationNode()
    //console.log((propertyAssignment.getDescendants()[2] as Identifier).getDefinitions()[0].getDeclarationNode().getChildAtIndex(2));
    let varDeclaration = definition.getSymbol().getValueDeclaration() as VariableDeclaration;
    let objectLiteralExpression = varDeclaration.getInitializer() as ObjectLiteralExpression;
    let name: string = objectLiteralExpression.getProperty('name').getChildAtIndex(2).getText();
    let basepath: string = objectLiteralExpression.getProperty('basepath').getChildAtIndex(2).getText();

    let routes: IGeneratorRoute[] = [];
    let listPropAssigment = objectLiteralExpression.getProperty('routes') as PropertyAssignment;
    let routeArrayDeclaration = listPropAssigment.getInitializer() as ArrayLiteralExpression;
    //Getting routes
    for (let element of routeArrayDeclaration.getElements()) {
        let elementIdentifier: Identifier = element as Identifier;
        let routeDeclaration = elementIdentifier.getSymbol().getValueDeclaration() as VariableDeclaration;
        let routeLiteralExpression = routeDeclaration.getInitializer() as ObjectLiteralExpression;
        let routeName = routeDeclaration.getFirstChild().getText();
        let path: string = routeLiteralExpression.getProperty('path').getChildAtIndex(2).getText();
        let method = (routeLiteralExpression.getProperty('method').getChildAtIndex(2).getChildAtIndex(2).getSymbol().getValueDeclaration() as EnumMember).getValue() as ERouteMethod;


        let types = GetTypeParameters(routeDeclaration);
        let requestName: string = types[0];
        let responseName: string = types[1];
        let paramsName: string = types[2];
        let paramDefList: { key: string, type: string }[] = ParamDefListFromLast(routeDeclaration);

        routes.push({
            routeName: cleanStr(routeName),
            method: method,
            paramTypeOrder: paramDefList,
            path: cleanStr(path),
            paramTypeName: cleanStr(paramsName),
            requestTypeName: cleanStr(requestName),
            responseTypeName: cleanStr(responseName)
        })
    }
    return {
        name: cleanStr(name),
        basepath: cleanStr(basepath),
        routes: routes
    }
}
