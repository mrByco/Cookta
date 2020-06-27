import {IServerReport} from '../../models/report/report.model';

export interface IReportService {
    GetAll(): Promise<IServerReport[]>,

    Create(): Promise<IServerReport>,

    ResolveReport(): Promise<void>,

    DeleteReport(): Promise<void>
}
