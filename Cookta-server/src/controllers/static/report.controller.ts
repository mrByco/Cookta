import {Controller} from 'waxen/dist/deorators/controller';
import {Contracts} from 'cookta-shared/src/contracts/contracts';
import {ICreateReportRequest} from 'cookta-shared/src/contracts/reports/create-report.request.interface';
import {IReport} from 'cookta-shared/src/models/report/report.interface';
import {Services} from '../../Services';
import {Security} from 'waxen/dist/deorators/security';
import { User } from "../../models/user.model";

@Controller(Contracts.Reports)
export class ReportController {

    @Security(false, 'read-reports')
    public async GetReports(reqBody: void, user: User): Promise<IReport[]> {
        return Services.ReportService.GetAll();
    }

    @Security(false, 'manage-reports')
    public async DeleteReport(reqBody: void, user: User, id: string): Promise<void> {
        await Services.ReportService.DeleteReport(id);
    }

    @Security(false, 'manage-reports')
    public async ResolveReport(reqBody: void, user: User, id: string): Promise<void> {
        await Services.ReportService.ResolveReport(id);
    }

    public async CreateReport(reqBody: ICreateReportRequest): Promise<void> {
        await Services.ReportService.Report('client', reqBody.report_type, reqBody.data, reqBody.desc);
    }
}
