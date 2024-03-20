import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { decodeFromBase64 } from 'src/app/config/encryption';
import { BusDetails } from 'src/app/models/bus.model';
import environment from 'src/environments/environment';
import {
  HourlyTransaction,
  TransactionTotal,
} from '../../models/transactions.model';
import { currentDate, goodKreditLogo } from 'src/app/constants/constants';
import { TableExportService } from 'src/app/services/table-export.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-print-hourly-transanction-logs',
  templateUrl: './print-hourly-transanction-logs.component.html',
  styleUrls: ['./print-hourly-transanction-logs.component.scss'],
})
export class PrintHourlyTransanctionLogsComponent {
  private activatedRoutes = inject(ActivatedRoute);
  private tableExportService = inject(TableExportService);
  private toastService = inject(ToastService);

  currentDate = currentDate;
  busData: BusDetails;
  hourlyTransactionLogs: HourlyTransaction[];
  companyLogo: string = goodKreditLogo;
  overallTransactionHeader: TransactionTotal[];

  constructor() {
    const dataParams = this.activatedRoutes.snapshot.queryParams['data'];
    const data = environment.production
      ? decodeFromBase64(dataParams)
      : JSON.parse(decodeURIComponent(dataParams));
    this.busData = data.busData as BusDetails;
    this.hourlyTransactionLogs =
      data.hourlyTransactionLogs as HourlyTransaction[];
    this.overallTransactionHeader =
      data.totalTransactionHeader as TransactionTotal[];
  }

  onPrint() {
    window.print();
  }

  exportToExcel() {
    console.log('Exporting to excel');
    this.tableExportService.exportTableToExcel(
      'hourly-transaction-logs',
      'Hourly Transaction Logs'
    );
    this.toastService.show({
      message: 'Hourly Transaction Logs exported successfully',
      duration: 3000,
    });
  }
}
