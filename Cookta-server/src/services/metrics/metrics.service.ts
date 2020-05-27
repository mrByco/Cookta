import {LiveConnect} from '../live-connection/live.connect';

export class MetricsService {

    CurrentActive: number;
    constructor(liveConnect: LiveConnect) {
        liveConnect.OnConnection.addListener('Connected', () => {
            this.CurrentActive = liveConnect.Connections.length;
        });
        liveConnect.OnConnection.addListener('Disconnected', () => {
            this.CurrentActive = liveConnect.Connections.length;
        });
    }

}
