import {ControllerData} from "../abstract/controller.interface";

export function Api (controller: ControllerData){
    return function (constructor: Function) {
        constructor.prototype.Controller = controller;
    }
}
