import {ClassDeclaration, Project, ScriptTarget, SourceFile} from "ts-morph";

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

export function GenerateControllers(tsConfigPath: string) {
    console.log(`Reading tsconfig at: ${tsConfigPath}`)
    const project = GetProject();
    project.addSourceFilesFromTsConfig(tsConfigPath);
    let files = project.getSourceFiles();
    console.log('Controller files: ')
    let controllerClasses = GetControllerFiles(files);
    controllerClasses.forEach(c => console.log('   - ' + c.getName()));
};
