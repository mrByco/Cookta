import {IRoute} from 'waxen/dist/abstract/route.interface';
import {ERouteMethod} from 'waxen/dist/route-method.enum';
import {ControllerData} from 'waxen/dist/abstract/controller.interface';
import {ICreateReportRequest} from './create-report.request.interface';

const GetReports: IRoute<void, void, void> = {method: ERouteMethod.GET, path: ''};
const DeleteReport: IRoute<void, void, { id: string }> = {method: ERouteMethod.DELETE, path: ''};
const ResolveReport: IRoute<void, void, { id: string }> = {method: ERouteMethod.GET, path: 'resolve'};
const CreateReport: IRoute<ICreateReportRequest, void, void> = {method: ERouteMethod.POST, path: ''};

export const ReportControllerData: ControllerData = {
    basepath: 'report', name: 'Report', routes: [GetReports, DeleteReport, ResolveReport, CreateReport]
};
