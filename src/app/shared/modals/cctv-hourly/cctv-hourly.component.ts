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
  selector: 'app-cctv-hourly',
  templateUrl: './cctv-hourly.component.html',
  styleUrls: ['./cctv-hourly.component.scss'],
})
export class CctvHourlyComponent implements OnChanges, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  readonly transactionHeaders = [
    'Transaction Hour',
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
  cctvHourlyLogs: HourlyTransaction[] = [];

  isLoading: boolean = true;
  isError: boolean = false;
  statusMessage: string = 'Fetching hourly CCTV logs';
  errorMessage: string = '';

  constructor(private httpService: HttpService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['busData'].firstChange) return;
    if (!changes['busData'].currentValue) return;

    this.getHourlyCCTVLogs();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getHourlyCCTVLogs() {
    this.isError = false;
    this.isLoading = true;
    this.totalTransactionHeader.forEach(header => (header.value = 0));
    this.cctvHourlyLogs = [];

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
      .get('transactions/hourlyCCTV', params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          const cctvHourlyTransactions = response.data as HourlyTransaction[];

          if (!cctvHourlyTransactions.length) {
            this.statusMessage = 'No CCTV hourly logs found';
            return;
          }

          cctvHourlyTransactions.forEach(hourly => {
            this.totalTransactionHeader[0].value += hourly.tranCount || 0;
            this.totalTransactionHeader[1].value += hourly.grossAmt || 0;
            this.totalTransactionHeader[2].value += hourly.paxCount || 0;
            this.totalTransactionHeader[3].value += hourly.cctvEnter || 0;
            this.totalTransactionHeader[4].value += hourly.cctvExit || 0;
          });

          this.cctvHourlyLogs = cctvHourlyTransactions;
        },
        error: error => {
          console.error(error);
          this.isLoading = false;
          this.isError = true;
          this.errorMessage =
            error.error?.message ||
            error.message ||
            'Error fetching CCTV hourly transactions';
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  onPrint() {
    const data = {
      busData: this.busData,
      hourlyLogs: this.cctvHourlyLogs,
      totalTransactionHeader: this.totalTransactionHeader,
    };
    const transformedData = environment.production
      ? encodeToBase64(JSON.stringify(data))
      : JSON.stringify(data);
    window.open(
      `#/print/cctv-hourly-logs?data=${transformedData}`,
      '_blank',
      'location=yes,height=800,width=1100,scrollbars=yes,status=yes'
    );
  }
}
