import {
    ArrayLiteralExpression,
    ClassDeclaration, EnumMember, Identifier,
    LiteralExpression,
    ObjectLiteralExpression,
    Project, PropertyAccessExpression, PropertyAssignment,
    ScriptTarget,
    SourceFile, StringLiteral, SyntaxList, VariableDeclaration, VariableStatement
} from "ts-morph";
import {ControllerData} from "waxen/dist/abstract/controller.interface";
import {IRoute} from "waxen/dist/abstract/route.interface";
import {ERouteMethod} from "waxen/dist/route-method.enum";
import {cpus} from "os";

const GetProject: (tsConfigPath?: string) => Project = (tsConfigPath?: string) => {
    return tsConfigPath ?
        new Project({tsConfigFilePath: tsConfigPath}) :
        new Project({
            compilerOptions: {
                target: ScriptTarget.ES5
            }
        })
}
function GetControllerFiles(files: SourceFile[]): ClassDeclaration[]{
    let classes = [];
    for (let file of files) {
        if (file.getClasses().length > 0)
            for (let c of file.getClasses()){
                if(c.getDecorator('Controller')){
                    classes.push(c);
                }
            }
    }
    return classes;
}

function GetGenericTypeByIndex(index: number, statement: VariableDeclaration): string{
    //+1 ve have pluss one child in the beginning
    let syntaxList = statement.getChildAtIndex(2).getChildAtIndex(index + 2) as SyntaxList;
    syntaxList.getChildren().forEach(t => {
        console.log(t.getText());
    });
   // console.log(statement.getFirstChild().getChildAtIndex(index + 1).getText());
    return '';
}


function FixController(controller: ClassDeclaration){
    console.log('Generating ' + controller.getName() + '....');
    let controllerInfo: ControllerData;
    try {
        let firstArg: PropertyAccessExpression = controller.getDecorator('Controller')?.getArguments()[0] as PropertyAccessExpression;
        //Get the Controller data
        let propertyAssignment = firstArg.getSymbol().getValueDeclaration() as PropertyAssignment;
        let varDeclaration = propertyAssignment.getInitializer().getSymbol().getValueDeclaration() as VariableDeclaration;
        let objectLiteralExpression = varDeclaration.getInitializer() as ObjectLiteralExpression;
        let name: string = objectLiteralExpression.getProperty('name').getChildAtIndex(2).getText();
        let basepath: string = objectLiteralExpression.getProperty('basepath').getChildAtIndex(2).getText();

        let routes = [];
        let listPropAssigment = objectLiteralExpression.getProperty('routes') as PropertyAssignment;
        let routeArrayDeclaration = listPropAssigment.getInitializer() as ArrayLiteralExpression;
        //Getting routes
        for (let element of routeArrayDeclaration.getElements()){
            let elementIdentifier: Identifier = element as Identifier;
            let routeDeclaration = elementIdentifier.getSymbol().getValueDeclaration() as VariableDeclaration;
            let routeLiteralExpression = routeDeclaration.getInitializer() as ObjectLiteralExpression;
            let path: string = routeLiteralExpression.getProperty('path').getChildAtIndex(2).getText();
            let method = (routeLiteralExpression.getProperty('method').getChildAtIndex(2).getChildAtIndex(2).getSymbol().getValueDeclaration() as EnumMember).getValue() as ERouteMethod;
            console.log(method);
            console.log(path);

            //let resposeClass =



           let responseName: string = GetGenericTypeByIndex(0, routeDeclaration);
            /*let requestName: string;
            let paramsName: string;*/

        }


    }
    catch (error){
        console.error(error);
        console.log(controller.getName() + ' is not valid.');
    }
    throw new Error()
    console.log(controllerInfo);

}

export function GenerateControllers(tsConfigPath: string) {
    console.log(`Reading tsconfig at: ${tsConfigPath}`)
    const project = GetProject();
    project.addSourceFilesFromTsConfig(tsConfigPath);
    let files = project.getSourceFiles();
    console.log('Controller files: ')
    let controllerClasses = GetControllerFiles(files);
    controllerClasses.forEach(c => console.log('   - ' + c.getName()));
    controllerClasses.forEach(c => FixController(c));
};
