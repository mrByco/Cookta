import {GenerateRouter, InitWaxen} from "./main";
import {GenerateControllers} from "./sub-generators/controller-generator";
import {GetEndpointData} from "./utility/utility";
import {GenerateApis} from "./sub-generators/api-generator";

export function waxen(args: any[]) {
    console.log('COMMANDO');
    console.log(process.cwd());

    if (args.length < 2){
        console.log('Not enough parameter');
        return;
    }

    if (!InitWaxen(process.cwd() + "/tsconfig.json")){
        console.log('Please create wconfig.json file.');
        return;
    }

    if (args.length == 2){
        console.log('You can execute: \n    - waxen generate\n  OR\n    - waxen swagger')
        return;
    }
    if (args[2] == 'generate'){
        let data = GenerateControllers(process.cwd() + "/tsconfig.json");
        GenerateRouter(process.cwd() + "/tsconfig.json", data);
    }

    if (args[2] == 'api'){
        let data = GenerateApis(process.cwd() + "/tsconfig.json");
    }
    if (args[2] == 'swagger'){
        console.log('Hello friend this feature not implemented :(');
    }
}
