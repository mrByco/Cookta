import {GenerateControllers} from "./main";

export function generateControllers(args) {
    console.log('COMMANDO');
    console.log(process.cwd());
    GenerateControllers(process.cwd() + "/tsconfig.json");
}
