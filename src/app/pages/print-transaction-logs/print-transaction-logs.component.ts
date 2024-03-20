import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { decodeFromBase64 } from 'src/app/config/encryption';
import { getMerchant } from 'src/app/config/getMerchantData';
import { currentDate, goodKreditLogo } from 'src/app/constants/constants';
import { BusDetails } from 'src/app/models/bus.model';
import {
  Transaction,
  TransactionTotal,
} from 'src/app/models/transactions.model';
import { HttpService } from 'src/app/services/http.service';
import { TableExportService } from 'src/app/services/table-export.service';
import { ToastService, ToastType } from 'src/app/services/toast.service';
import environment from 'src/environments/environment';

@Component({
  selector: 'app-print-transaction-logs',
  templateUrl: './print-transaction-logs.component.html',
  styleUrls: ['./print-transaction-logs.component.scss'],
})
export class PrintTransactionLogsComponent {
  private activatedRoutes = inject(ActivatedRoute);
  private tableExportService = inject(TableExportService);
  private toastService = inject(ToastService);

  companyLogo = goodKreditLogo;
  transactionLogs: Transaction[] = [];
  busData: BusDetails;
  totalTransactionHeader: TransactionTotal[];

  currentDate = currentDate;

  totalFareAmount: number = 0;
  totalPassengers: number = 0;
  totalTransaction: number = 0;
  totalDiscount: number = 0;

  constructor() {
    const dataParams = this.activatedRoutes.snapshot.queryParams['data'];
    const data = environment.production
      ? decodeFromBase64(dataParams)
      : JSON.parse(decodeURIComponent(dataParams));
    this.busData = data.busData as BusDetails;
    const transactions = data.transactionLogs as Transaction[];
    this.transactionLogs = transactions;
    this.totalTransactionHeader =
      data.totalTransactionHeader as TransactionTotal[];
  }

  onPrint() {
    window.print();
  }

  exportToExcel() {
    this.tableExportService
      .exportTableToExcel('transaction-table', 'Transaction Logs')
      .subscribe({
        next: () => {
          this.toastService.show({
            message: 'Transaction Logs exported successfully',
            duration: 3000,
          });
        },
        error: () => {
          this.toastService.show({
            message: 'Error exporting Transaction Logs',
            type: ToastType.ERROR,
            duration: 3000,
          });
        },
      });
  }
}
