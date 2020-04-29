import {Controller} from "waxen/dist/abstract/controller.interface";

export function Controller (controller: Controller){
    return function (constructor: Function) {
        constructor.prototype.Controller = controller;
    }
}