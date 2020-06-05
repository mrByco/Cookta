import {LiveConnect} from '../live-connection/live.connect';
import {Collection, Db, MongoClient} from 'mongodb';
import {MetricsRecord} from "./metrics-record.interface";
import {CAUCollector} from "./collectors/cau.collector";

const TrafficCollectionName = 'Traffic';

require('../../extensions/date-extensions');

export class MetricsService {
    MetricsDatabase: Db;

    public CAUCollector: CAUCollector;

    constructor(liveConnect: LiveConnect, MongoClient: MongoClient) {
        if (!liveConnect || !MongoClient){
            console.log('Cant start metrics service!')
            return;
        }
        if (!MongoClient.isConnected()) {
            throw new Error('Mongo client has to be connected.');
        }
        this.MetricsDatabase = MongoClient.db('Metrics');
        this.CAUCollector = new CAUCollector(this, liveConnect);
    }

    //Returns the merged, saved data
    async SaveMetricsData(dataToMerge: MetricsRecord, workingCollection: Collection): Promise<MetricsRecord>{
        let currentHourId = MetricsService.GetCurrentHourId();

        let record: MetricsRecord = await workingCollection.findOne({date_hour: currentHourId}) as any;

        record = dataToMerge;
        if (record) {
            record = MetricsService.MergeMetricsData(record, dataToMerge);
        }else{
            record = dataToMerge;
        }


        await workingCollection.replaceOne({date_hour: currentHourId}, record, {upsert: true});


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

    static GetEmptyMetricsRecord(statKey: string): MetricsRecord{
        return {data: [], date_hour: this.GetCurrentHourId(), stat_key: statKey}
    }

    //Returns data in YYYYMMDDhh format
    static GetCurrentHourId(): string {
        return new Date(Date.now()).ToYYYYMMDDhhmmString().substring(0, 13)
    }

    static GetMinutesAndSeconds(): { minutes: number, seconds: number } {
        let now = new Date(Date.now());
        return {minutes: now.getMinutes(), seconds: now.getSeconds()};
    }


}
