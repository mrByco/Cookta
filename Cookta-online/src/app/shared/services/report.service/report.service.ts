import {Injectable} from '@angular/core';
import {ServerService} from "../server.service";
import {IReport} from "../../../../../../Cookta-shared/src/models/report/report.interface";

@Injectable()
export class ReportService {
    constructor(private serverService: ServerService) {
    }

    public GetReports(): Promise<IReport[]>{
        return new Promise(async (resolve, reject) => {
            let resp = await this.serverService.GetRequest('/report')
            resp.subscribe(d => {
                let data = d as IReport[];
                resolve(data)
            }, error => {
                reject(error);
            });
        })
    }

    public DeleteReport(id: string){
        return new Promise(async (resolve, reject) => {
            let resp = await this.serverService.DeleteRequest('/report/' + id)
            resp.subscribe(() => {
                resolve()
            }, error => {
                reject(error);
            });
        })
    }
}
