import {ACollector} from "./collector.abstract";
import {MetricsRecord} from "../metrics-record.interface";
import {Collection, ObjectId} from "mongodb";
import {MetricsService} from "../metrics.service";
import {LiveConnect} from "../../live-connection/live.connect";

export class CAUCollector extends ACollector {

    public CurrentActive: number = 0;
    public MaxDuringCollectLoop: number = 0;

    private collectLoop;
    private saveLoop;

    private LastSaved: MetricsRecord;
    private UnsavedRecord: MetricsRecord;
    private readonly CAUCollection: Collection;
    private readonly SaveTime = 60;
    private readonly CollectTime = 10;
    private readonly COLLECTION_NAME = 'CAU';

    constructor(metricsService: MetricsService, liveConnect: LiveConnect) {
        super(metricsService);
        this.CAUCollection = metricsService.MetricsDatabase.collection(this.COLLECTION_NAME);
        this.InitDataCollection(liveConnect)
    }

    InitDataCollection(liveConnect) {
        liveConnect.OnConnection.addListener('Connected', () => {
            this.CurrentActiveChange(liveConnect);
        });
        liveConnect.OnConnection.addListener('Disconnected', () => {
            this.CurrentActiveChange(liveConnect);
        });

        this.collectLoop = setInterval(async () => {
            if (!this.UnsavedRecord){
                this.UnsavedRecord = MetricsService.GetEmptyMetricsRecord("CAU");
            }

            let time = MetricsService.GetMinutesAndSeconds();
            if (!this.UnsavedRecord.data[time.minutes]) {
                this.UnsavedRecord.data[time.minutes] = [];
            }

            this.UnsavedRecord.data[time.minutes][time.seconds] = this.MaxDuringCollectLoop;
            this.MaxDuringCollectLoop = this.CurrentActive;


        }, this.CollectTime * 1000);

        this.saveLoop = setInterval(() => {
            if (!this.UnsavedRecord) return;
            this.MetricsService.SaveMetricsData(this.UnsavedRecord, this.CAUCollection).then(s => {
                //this.LastSaved = s;
                //this.UnsavedRecord = undefined;
            });
        }, this.SaveTime * 1000);
    }


    private CurrentActiveChange(liveConnect: LiveConnect){
        this.CurrentActive = liveConnect.Connections.length;
        if (this.CurrentActive > this.MaxDuringCollectLoop) this.MaxDuringCollectLoop = this.CurrentActive;
        console.log("Cahgne:: " + this.MaxDuringCollectLoop);
    }

    stop() {
        clearInterval(this.collectLoop);
        clearInterval(this.saveLoop);
    }

}