import {LiveConnect} from '../live-connection/live.connect';
import {Collection, Db, MongoClient, ObjectId} from 'mongodb';
import {MetricsRecord} from "./metrics-record.interface";
import {CAUCollector} from "./collectors/cau.collector";

const TrafficCollectionName = 'Traffic';


export class MetricsService {
    MetricsDatabase: Db;

    PeriodLength: number = 10000;
    CurrentActive: number;

    public CAUCollector: CAUCollector;

    constructor(liveConnect: LiveConnect, MongoClient: MongoClient) {
        if (!liveConnect || !MongoClient){
            console.log('Cant start metrics service!')
            return;
        }
        liveConnect.OnConnection.addListener('Connected', () => {
            this.CurrentActive = liveConnect.Connections.length;
        });
        liveConnect.OnConnection.addListener('Disconnected', () => {
            this.CurrentActive = liveConnect.Connections.length;
        });
        if (!MongoClient.isConnected()) {
            throw new Error('Mongo client has to be connected.');
        }
        this.InitDataCollection(MongoClient);

    }

    //Returns the merged, saved data
    async SaveMetricsData(dataToMerge: MetricsRecord, workingCollection: Collection): Promise<MetricsRecord>{
        let currentHourId = this.GetCurrentHourId();

        let record: MetricsRecord = await workingCollection.find({key_id: currentHourId}) as any;

        if (!record) {
            record = {_id: new ObjectId(), data: [], key_id: currentHourId, stat_key: 'current_active'};
        }

        record = MetricsService.MergeMetricsData(record, dataToMerge);

        await workingCollection.replaceOne({key_id: currentHourId}, record, {upsert: true});

        return record;
    }

    static MergeMetricsData(mergeInto: MetricsRecord, mergeIt: MetricsRecord): MetricsRecord{
        for (let mIndex in mergeIt.data){
            for (let sIndex in mergeIt.data[mIndex]){
                if (!mergeIt.data[mIndex][sIndex]) continue;
                if (!mergeInto.data[mIndex]) {
                    mergeInto.data[mIndex] = [];
                }
                mergeInto.data[mIndex][sIndex] = mergeIt.data[mIndex][sIndex];
            }
        }
        return mergeInto;
    }

    async InitDataCollection(MongoClient) {
        this.MetricsDatabase = MongoClient.db('Metrics');
        let trafficCollection = await this.MetricsDatabase.collection(TrafficCollectionName);
        setInterval(async () => {
            let currentHourId = this.GetCurrentHourId();
            let record: MetricsRecord = await trafficCollection.find({key_id: currentHourId}) as any;

            if (!record) {
                record = {_id: new ObjectId(), data: [], key_id: currentHourId, stat_key: 'current_active'};
            }

            let timecode = this.GetMinutesAndSeconds();
            if (!record.data[timecode.minutes]) {
                record.data[timecode.minutes] = record[timecode.minutes] = [];
            }
            record.data[timecode.minutes][timecode.seconds] = this.CurrentActive;

            await trafficCollection.replaceOne({key_id: currentHourId}, record, {upsert: true});
        }, this.PeriodLength);
    }

    //Returns data in YYYYMMDD_hh format
    GetCurrentHourId(): string {
        throw new Error();
    }

    GetMinutesAndSeconds(): { minutes: number, seconds: number } {
        throw new Error();
    }


}
