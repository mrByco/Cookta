import {ObjectId} from "mongodb";

export interface MetricsRecord {
    stat_key: string,
    //YYYYMMDD_hh
    date_hour: string,
    data: any[][]
}