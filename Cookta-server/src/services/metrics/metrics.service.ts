import {LiveConnect} from '../live-connection/live.connect';
import {Collection, Db, MongoClient} from 'mongodb';
import {MetricsRecord} from './metrics-record.interface';
import {CAUCollector} from './collectors/cau.collector';
import {Guid} from 'guid-typescript';


require('../../extensions/date-extensions');

export class MetricsService {
    MetricsDatabase: Db;

    public CAUCollector: CAUCollector;

    private static get metrics_instance_id() {
        if (!this.m_metrics_instance_id)  this.m_metrics_instance_id = process.env.WEBSITE_INSTANCE_ID ? `prod-${process.env.WEBSITE_INSTANCE_ID}` : `debug-${Guid.create().toString()}`;
        return this.m_metrics_instance_id;
    }
    private static m_metrics_instance_id: string;

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

        let record: MetricsRecord = await workingCollection.findOne({date_hour: currentHourId, instance_id: MetricsService.metrics_instance_id}) as any;

        if (record)
            record = MetricsService.MergeMetricsData(record, dataToMerge);
        else
            record = dataToMerge;



        await workingCollection.replaceOne({date_hour: currentHourId, instance_id: MetricsService.metrics_instance_id}, record, {upsert: true});


        return record;
    }

    static MergeMetricsData(mergeInto: MetricsRecord, mergeIt: MetricsRecord): MetricsRecord{
        for (let mIndex in mergeIt.data){
            for (let sIndex in mergeIt.data[mIndex]){
                if (mergeIt.data[mIndex][sIndex] === undefined || mergeIt.data[mIndex][sIndex] === null) continue;
                if (!mergeInto.data[mIndex]) {
                    mergeInto.data[mIndex] = [];
                }
                mergeInto.data[mIndex][sIndex] = mergeIt.data[mIndex][sIndex];
            }
        }
        return mergeInto;
    }

    static GetEmptyMetricsRecord(statKey: string): MetricsRecord{
        return {instance_id: MetricsService.metrics_instance_id, data: [], date_hour: this.GetCurrentHourId(), stat_key: statKey}
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
