import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { decodeFromBase64 } from 'src/app/config/encryption';
import { currentDate, goodKreditLogo } from 'src/app/constants/constants';
import { BusDetails } from 'src/app/models/bus.model';
import { Zreading } from 'src/app/models/transactions.model';
import environment from 'src/environments/environment';

@Component({
  selector: 'app-print-zreading-logs',
  templateUrl: './print-zreading-logs.component.html',
  styleUrls: ['./print-zreading-logs.component.scss'],
})
export class PrintZreadingLogsComponent {
  private activatedRoutes = inject(ActivatedRoute);

  companyLogo = goodKreditLogo;
  currentDate = currentDate;
  zreadingLogs: Zreading[];
  busData: BusDetails;

  constructor() {
    const dataParams = this.activatedRoutes.snapshot.queryParams['data'];
    const data = environment.production
      ? decodeFromBase64(dataParams)
      : JSON.parse(decodeURIComponent(dataParams));
    this.busData = data.busData as BusDetails;
    this.zreadingLogs = data.zreadingLogs as Zreading[];
  }

  onPrint() {
    window.print();
  }
}
