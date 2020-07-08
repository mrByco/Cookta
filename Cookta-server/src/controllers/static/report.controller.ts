import {Controller} from 'waxen/dist/deorators/controller';
import {Contracts} from 'cookta-shared/src/contracts/contracts';
import {ICreateReportRequest} from 'cookta-shared/src/contracts/reports/create-report.request.interface';
import {IReport} from 'cookta-shared/src/models/report/report.interface';
import {Services} from '../../Services';

@Controller(Contracts.Reports)
export class ReportController {

    public async GetReports(reqBody: void): Promise<IReport[]> {
        return Services.ReportService.GetAll();
    }

    public async DeleteReport(reqBody: void, id: string): Promise<void> {
        await Services.ReportService.DeleteReport(id);
    }

    public async ResolveReport(reqBody: void, id: string): Promise<void> {
        await Services.ReportService.ResolveReport(id);
    }

    public async CreateReport(reqBody: ICreateReportRequest): Promise<void> {
        await Services.ReportService.Create('client', reqBody.report_type, reqBody.data, reqBody.desc);
    }
}
