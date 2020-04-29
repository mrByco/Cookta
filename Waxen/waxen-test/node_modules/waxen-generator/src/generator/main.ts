import {
    ClassDeclaration, Identifier,
    LiteralExpression,
    ObjectLiteralExpression,
    Project, PropertyAccessExpression,
    ScriptTarget,
    SourceFile
} from "ts-morph";
import {ControllerData} from "waxen/dist/abstract/controller.interface";

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

function FixController(controller: ClassDeclaration){
    console.log('Generating ' + controller.getName() + '....');
    let controllerInfo;
    try {
        let firstArg: PropertyAccessExpression = controller.getDecorator('Controller')?.getArguments()[0] as PropertyAccessExpression;
        console.log((firstArg.getChildren()));
        firstArg.getChildren().forEach((p) => {
            if (p instanceof Identifier){
                let identifier: Identifier = p as Identifier;
                console.log(identifier.getText());
            }
        })
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
