import {
  Component,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { encodeToBase64 } from 'src/app/config/encryption';
import { BusDetails, BusGeneral } from 'src/app/models/bus.model';
import {
  HourlyTransaction,
  TransactionTotal,
} from 'src/app/models/transactions.model';
import { HttpService } from 'src/app/services/http.service';
import { ModalService } from 'src/app/services/modal.service';
import environment from 'src/environments/environment';

@Component({
  selector: 'app-hourly-summary',
  templateUrl: './hourly-summary.component.html',
  styleUrls: ['./hourly-summary.component.scss'],
})
export class HourlySummaryComponent implements OnChanges, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  readonly transactionHeaders = [
    'Transaction Hour',
    'Station From',
    'Transaction Count',
    'Amount',
    'Pax',
    'CCTV Enter',
    'CCTV Exit',
  ];

  @Input() busData?: BusDetails;

  totalTransactionHeader: TransactionTotal[] = [
    {
      label: 'Overall Total Transactions',
      currency: false,
      value: 0,
    },
    {
      label: 'Overall Total Amount',
      currency: true,
      value: 0,
    },
    {
      label: 'Overall Total Passengers',
      currency: false,
      value: 0,
    },
    {
      label: 'Overall Total CCTV Enter',
      currency: false,
      value: 0,
    },
    {
      label: 'Overall Total CCTV Exit',
      currency: false,
      value: 0,
    },
  ];
  hourlyTransactionLogs: HourlyTransaction[] = [];

  isLoading: boolean = true;
  isError: boolean = false;
  statusMessage: string = 'Fetching hourly transaction logs';
  errorMessage: string = '';

  constructor(private httpService: HttpService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['busData'].firstChange) return;
    if (!changes['busData'].currentValue) return;

    this.getHourlyTransactionLogs();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getHourlyTransactionLogs() {
    this.isError = false;
    this.isLoading = true;
    this.totalTransactionHeader.forEach(header => (header.value = 0));
    this.hourlyTransactionLogs = [];

    if (!this.busData) {
      this.isError = true;
      this.errorMessage = 'No Bus selected';
      return;
    }

    const params = {
      IMEI: this.busData.IMEI,
      routeCode: this.busData.routeCode,
      date: this.busData.txnDate,
      branchID: this.busData.branchID,
    };

    this.httpService
      .get('transactions/hourly', params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          const hourlyTransactions = response.data as HourlyTransaction[];

          if (!hourlyTransactions.length) {
            this.statusMessage = 'No hourly transactions found';
            return;
          }

          hourlyTransactions.forEach(hourly => {
            this.totalTransactionHeader[0].value += hourly.tranCount || 0;
            this.totalTransactionHeader[1].value += hourly.grossAmt || 0;
            this.totalTransactionHeader[2].value += hourly.paxCount || 0;
            this.totalTransactionHeader[3].value += hourly.cctvEnter || 0;
            this.totalTransactionHeader[4].value += hourly.cctvExit || 0;
          });

          this.hourlyTransactionLogs = hourlyTransactions;
        },
        error: error => {
          console.error(error);
          this.isError = true;
          this.errorMessage = 'Error fetching hourly transactions';
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  onPrint() {
    const data = {
      busData: this.busData,
      hourlyTransactionLogs: this.hourlyTransactionLogs,
      totalTransactionHeader: this.totalTransactionHeader,
    };
    const transformedData = environment.production
      ? encodeToBase64(JSON.stringify(data))
      : JSON.stringify(data);
    window.open(
      '#/print/hourly-transaction-logs?data=' + transformedData,
      '_blank',
      'location=yes,height=800,width=1100,scrollbars=yes,status=yes'
    );
  }
}
