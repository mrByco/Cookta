import {IReport} from 'cookta-shared/src/models/report/report.interface';
import {ObjectID} from 'mongodb';

export class ServerReport {
    constructor(
        public reportType: string,
        public source: string,
        public desc: string,
        public data: any,
        public created: number,
        public id: string,
        public count: number) {
    }

    static FromStoreReport(docs: IStoreReport): ServerReport {
        return new ServerReport(docs.report_type, docs.source, docs.desc, docs.data, docs.created, docs._id.toHexString(), docs.count);
    }

    ToReport(): IReport {
        return {data: this.data, desc: this.desc, id: this.id, source: this.source, type: this.reportType, time: this.created, count: this.count};
    }

    ToStoreReport(): IStoreReport {
        return {
            _id: new ObjectID(this.id),
            created: this.created,
            data: this.data,
            desc: this.desc,
            report_type: this.reportType,
            source: this.source,
            count: this.count,
        };
    }

}

export interface IStoreReport {
    _id: ObjectID,
    report_type: string,
    source: string,
    desc: string,
    data: any,
    created: number,
    count: number
}
