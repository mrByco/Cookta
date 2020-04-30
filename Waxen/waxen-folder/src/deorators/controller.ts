import {ControllerData} from "../abstract/controller.interface";

export function Controller (controller: ControllerData){
    return function (constructor: Function) {
        constructor.prototype.Controller = controller;
    }
}
