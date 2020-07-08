import {IReport} from 'cookta-shared/src/models/report/report.interface';

export interface IReportService {
    GetAll(): Promise<IReport[]>,

    Create(source: string, type: string, data: any, desc?: string): Promise<IReport>,

    ResolveReport(id: string): Promise<void>,

    DeleteReport(id: string): Promise<void>
}
