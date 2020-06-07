import {Socket} from 'socket.io';

export abstract class ALiveController {
    constructor(protected Socket: Socket) {
    }
    abstract ShutDown()
}
