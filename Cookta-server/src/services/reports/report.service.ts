import {IReportService} from './report.service.interface';
import {IServerReport} from '../../models/report/report.model';

export class ReportService implements IReportService {

    Create(): Promise<IServerReport> {
        return Promise.resolve(undefined);
    }

    DeleteReport(): Promise<void> {
        return Promise.resolve(undefined);
    }

    GetAll(): Promise<IServerReport[]> {
        return Promise.resolve([]);
    }

    ResolveReport(): Promise<void> {
        return Promise.resolve(undefined);
    }

}
