import {Socket} from 'socket.io';
import {ALiveController} from '../live-controller.abstract';
import {MetricsData} from 'cookta-shared/src/live-messages/metrics.data';
import {Services} from '../../../Services';
import Timeout = NodeJS.Timeout;


export class MetricsController extends ALiveController {
    private readonly interval: Timeout;

    constructor(socket: Socket) {
        super(socket);
        this.interval = setInterval(() => this.RefreshData(), 1000);
    }

    public ShutDown() {
        clearInterval(this.interval);
    }

    private RefreshData() {
        let data: MetricsData = {ActiveUsers: Services.MetricsService.CAUCollector.CurrentActive};
        this.Socket.emit(MetricsData.RefreshEventName, data);
    }
}
