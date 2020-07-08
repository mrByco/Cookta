import {IReport} from 'cookta-shared/src/models/report/report.interface';
import {ObjectID} from 'mongodb';

export class ServerReport {
    constructor(
        public reportType: string,
        public source: string,
        public desc: string,
        public data: any,
        public created: number,
        public id: string) {
    }

    static FromStoreReport(docs: IStoreReport): ServerReport {
        return new ServerReport(docs.report_type, docs.source, docs.desc, docs.data, docs.created, docs._id.toHexString());
    }

    ToReport(): IReport {
        return {data: this.data, desc: this.desc, id: this.id, source: this.source, type: this.reportType, time: this.created};
    }

    ToStoreReport(): IStoreReport {
        return {
            _id: new ObjectID(this.id),
            created: this.created,
            data: this.data,
            desc: this.desc,
            report_type: this.reportType,
            source: this.source
        };
    }

}

export interface IStoreReport {
    _id: ObjectID,
    report_type: string,
    source: string,
    desc: string,
    data: any,
    created: number
}
