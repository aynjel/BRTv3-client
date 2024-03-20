import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { decodeFromBase64 } from 'src/app/config/encryption';
import { currentDate, goodKreditLogo } from 'src/app/constants/constants';
import { BusDetails } from 'src/app/models/bus.model';
import {
  HourlyTransaction,
  TransactionTotal,
} from 'src/app/models/transactions.model';
import { TableExportService } from 'src/app/services/table-export.service';
import { ToastService } from 'src/app/services/toast.service';
import environment from 'src/environments/environment';

@Component({
  selector: 'app-print-cctv-hourly-logs',
  templateUrl: './print-cctv-hourly-logs.component.html',
  styleUrls: ['./print-cctv-hourly-logs.component.scss'],
})
export class PrintCctvHourlyLogsComponent {
  private activatedRoutes = inject(ActivatedRoute);
  private tableExportService = inject(TableExportService);
  private toastService = inject(ToastService);

  companyLogo = goodKreditLogo;
  currentDate = currentDate;
  busData: BusDetails;
  hourlyLogs: HourlyTransaction[];
  totalTransactionHeader: TransactionTotal[];

  constructor() {
    const dataParams = this.activatedRoutes.snapshot.queryParams['data'];
    const data = environment.production
      ? decodeFromBase64(dataParams)
      : JSON.parse(decodeURIComponent(dataParams));
    this.busData = data.busData as BusDetails;
    this.hourlyLogs = data.hourlyLogs as HourlyTransaction[];
    this.totalTransactionHeader =
      data.totalTransactionHeader as TransactionTotal[];
  }

  onPrint() {
    window.print();
  }

  exportToExcel() {
    console.log('Exporting to excel');
    this.tableExportService.exportTableToExcel(
      'cctv-hourly-logs',
      'CCTV Hourly Logs'
    );
    this.toastService.show({
      message: 'CCTV Hourly Logs exported successfully',
      duration: 3000,
    });
  }
}
