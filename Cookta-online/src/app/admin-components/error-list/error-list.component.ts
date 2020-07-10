import { Component, OnInit } from '@angular/core';
import {ReportService} from '../../shared/services/report.service/report.service';
import {IReport} from '../../../../../Cookta-shared/src/models/report/report.interface';

@Component({
  selector: 'app-error-list',
  templateUrl: './error-list.component.html',
  providers: [ReportService],
  styleUrls: ['./error-list.component.css']
})
export class ErrorListComponent implements OnInit {

  public Reports: IReport[] = [];

  constructor(public reportService: ReportService) { }

  ngOnInit(): void {
    this.reportService.GetReports().then(reports => this.Reports = reports);
  }

  ToTimeString(time: number) {
    return new Date(time).toISOString()
  }
}
