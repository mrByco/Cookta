import {ObjectId} from "mongodb";

export interface MetricsRecord {
    instance_id: string,
    stat_key: string,
    //YYYYMMDD_hh
    date_hour: string,
    data: any[][]
}