import {Controller} from "tsoa";

export class RequestHelper {

    public static async ExecuteRequest<T>(controller: Controller, GetValue: () => Promise<T> | T): Promise<T>{
        try{
            return Promise.resolve(await GetValue());
        }
        catch (error){
            controller.setStatus(500);
            console.log(error);
            return Promise.reject("Internal error: " + error.toString());
        }
    }

    public static ValidateFields(object: any, fields: string[]){
        let notExist: string[] = [];
        for (let checkKey of fields){
            let ObjectKeys = Object.keys(object);
            if (!ObjectKeys.includes(checkKey)){
                notExist.push(checkKey);
            }
        }
        if (notExist.length > 0){
            throw new Error(`Types not exist in object. Object: ${object} | Missing fields: ${notExist}`);
        }
    }
}
