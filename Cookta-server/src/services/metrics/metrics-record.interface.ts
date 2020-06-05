import {ObjectId} from "mongodb";

export interface MetricsRecord {
    _id: ObjectId;
    //YYYYMMDD_hh
    stat_key: string,
    key_id: string,
    data: any[][]
}