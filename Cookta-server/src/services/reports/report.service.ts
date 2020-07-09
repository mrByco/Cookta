import {IReportService} from './report.service.interface';
import {IStoreReport, ServerReport} from '../../models/report/report.model';
import {Collection, ObjectID} from 'mongodb';
import {IReport} from 'cookta-shared/src/models/report/report.interface';

export class ReportService implements IReportService {

    constructor(private collection: Collection) {
    }


    async Report(source: string, type: string, data: any, desc?: string): Promise<IReport> {
        desc = desc?? '';
        let report: ServerReport = await this.collection.findOne({data: data, desc: desc, report_type: type, source: source}).then(d => {
            return d ? ServerReport.FromStoreReport(d) : undefined;
        });

        if (!report) report = new ServerReport(type, source, desc, data, Date.now(), new ObjectID().toHexString(), 1);
        else report.count++;

        await this.SaveReport(report);
        return report.ToReport();
    }

    DeleteReport(id: string): Promise<void> {
        throw new Error('Not implemented');
    }

    GetAll(): Promise<IReport[]> {
        return this.collection.find().toArray()
            .then((a: IStoreReport[]) => a
                .map(a => ServerReport.FromStoreReport(a))
                .map(a => a.ToReport()));
    }

    ResolveReport(id: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    private async SaveReport(report: ServerReport) {
        let docs = report.ToStoreReport();
        await this.collection.replaceOne({_id: docs._id}, docs, {upsert: true});
    }

}
