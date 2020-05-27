import {Server, Socket} from 'socket.io';
import { EventEmitter } from 'events';
import {ALiveController} from '../../controllers/live/live-controller.abstract';
import {MetricsController} from '../../controllers/live/metrics/metrics.controller';


interface Partner {
    Socket: Socket
    Controllers: ALiveController[];
}

export class LiveConnect {

    public Connections: Partner[] = [];
    public readonly OnConnection: EventEmitter = new EventEmitter();

    constructor(server) {
        const io: Server = require('socket.io')(server);
        io.on('connection', (socket) => {
            socket.on('disconnect', () => {
                let connectIndex = this.Connections.findIndex(c => c.Socket == socket);
                if (connectIndex == -1) return;
                this.Connections.splice(connectIndex, 1);
                this.OnConnection.emit('Disconnected');
            });
            let partner = {Socket: socket, Controllers: []};
            this.Connections.push(partner);
            partner.Controllers.push(new MetricsController(socket));

            this.OnConnection.emit('Connected');
        });
    }
}
