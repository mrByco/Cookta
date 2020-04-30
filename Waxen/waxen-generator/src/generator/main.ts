import {ClassDeclaration, Project, ScriptTarget, SourceFile} from "ts-morph";
import {GenerateController} from "./sub-generators/controller-generator";
import {GetControllerData} from "./utility/utility";

let wcfg: {
    routeDir?: string
};

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


export function InitWaxen(): boolean {
    try {
        wcfg = require(process.cwd() + '/wconfig.json')
        return wcfg != undefined;
    } catch (error) {
        return false;
    }
}

export function GenerateControllers(tsConfigPath: string) {
    console.log(`Reading tsconfig at: ${tsConfigPath}`)
    const project = GetProject();
    project.addSourceFilesFromTsConfig(tsConfigPath);
    let files = project.getSourceFiles();
    //TODO Check controller classes can not have the same name
    console.log('Controller files: ');
    let controllerClasses = GetControllerFiles(files);
    controllerClasses.forEach(c => console.log('   - ' + c.getName()));
    controllerClasses.forEach(c => GenerateController(c, GetControllerData(c)));
    project.saveSync();
};

export function GenerateRouter() {
    console.log('Generating router...');
    const project = GetProject();
    let file = project.createSourceFile(wcfg.routeDir ? wcfg.routeDir + '/router.ts' : './router.ts', {}, {overwrite: true});



    
    file.saveSync();
}
