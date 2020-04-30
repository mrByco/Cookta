import {GenerateControllers, GenerateRouter, InitWaxen} from "./main";

export function waxen(args: any[]) {
    console.log('COMMANDO');
    console.log(process.cwd());

    if (args.length < 2){
        console.log('Not enough parameter');
        return;
    }

    if (!InitWaxen()){
        console.log('Please create wconfig.json file.');
        return;
    }

    if (args.length == 2){
        console.log('You can execute: \n    - waxen generate\n  OR\n    - waxen swagger')
        return;
    }
    if (args[2] == 'generate'){
        GenerateControllers(process.cwd() + "/tsconfig.json");
        GenerateRouter();
    }
    if (args[2] == 'swagger'){
        console.log('Hello friend this feature not implemented :(');
    }
}
