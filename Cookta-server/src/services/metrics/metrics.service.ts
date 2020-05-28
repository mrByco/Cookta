import {LiveConnect} from '../live-connection/live.connect';
import {Db, MongoClient, ObjectId} from 'mongodb';

const TrafficCollectionName = 'Traffic';

export interface StatHour {
    _id: ObjectId;
    //YYYYMMDD_hh
    stat_key: string,
    key_id: string,
    data: any[][]
}

export class MetricsService {
    MetricsDatabase: Db;

    PeriodLength: number = 10000;
    CurrentActive: number;

    constructor(liveConnect: LiveConnect, MongoClient: MongoClient) {
        liveConnect.OnConnection.addListener('Connected', () => {
            this.CurrentActive = liveConnect.Connections.length;
        });
        liveConnect.OnConnection.addListener('Disconnected', () => {
            this.CurrentActive = liveConnect.Connections.length;
        });
        if (!MongoClient.isConnected()) {
            throw new Error('Mongo client has to be connected.');
        }
        this.InitDataColleciton(MongoClient);

    }

    async InitDataColleciton(MongoClient) {
        this.MetricsDatabase = MongoClient.db('Metrics');
        let trafficCollection = await this.MetricsDatabase.collection(TrafficCollectionName);
        setInterval(async () => {
            let currentHourId = this.GetCurrentHourId();
            let hourData: StatHour = await trafficCollection.find({key_id: currentHourId}) as any;

            if (!hourData) {
                hourData = {_id: new ObjectId(), data: [], key_id: currentHourId, stat_key: 'current_active'};
            }

            let timecode = this.GetMinutesAndSeconds();
            if (!hourData.data[timecode.minutes]) {
                hourData.data[timecode.minutes] = hourData[timecode.minutes] = [];
            }
            hourData.data[timecode.minutes][timecode.seconds] = this.CurrentActive;

            await trafficCollection.replaceOne({key_id: currentHourId}, hourData, {upsert: true});
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
