import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { encodeToBase64 } from 'src/app/config/encryption';
import { getMerchant } from 'src/app/config/getMerchantData';
import { BusDetails, BusGeneral } from 'src/app/models/bus.model';
import {
  Transaction,
  TransactionTotal,
} from 'src/app/models/transactions.model';
import { HttpService } from 'src/app/services/http.service';
import environment from 'src/environments/environment';

@Component({
  selector: 'app-transaction-logs',
  templateUrl: './transaction-logs.component.html',
  styleUrls: ['./transaction-logs.component.scss'],
})
export class TransactionLogsComponent implements OnChanges, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  readonly transactionHeaders = [
    'Transact Date',
    'Sync Date',
    'Start Station',
    'End Station',
    'Distance',
    'Passenger',
    'Fare',
    'Discount',
    'Total Amt',
    'Location',
  ];

  @Input() busData?: BusDetails;

  totalTransactionHeader: TransactionTotal[] = [
    {
      label: 'Overall Total Amount',
      currency: true,
      distance: false,
      value: 0,
    },
    {
      label: 'Overall Total Discount',
      currency: true,
      distance: false,
      value: 0,
    },
    {
      label: 'Overall Total Transactions',
      currency: false,
      distance: false,
      value: 0,
    },
    {
      label: 'Overall Total Passengers',
      currency: false,
      distance: false,
      value: 0,
    },
    {
      label: 'Overall Total Distance',
      currency: false,
      distance: true,
      value: 0,
    },
  ];
  transactionLogs: Transaction[] = [];

  isLoading: boolean = true;
  isError: boolean = false;
  statusMessage: string = 'Fetching transaction logs';
  errorMessage: string = '';

  constructor(private httpService: HttpService, private router: Router) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['busData'].firstChange) return;
    if (!changes['busData'].currentValue) return;

    this.getTransactionLogs();
  }

  getTransactionLogs() {
    this.isError = false;
    this.isLoading = true;
    this.totalTransactionHeader.forEach(header => (header.value = 0));
    this.transactionLogs = [];

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
      .get('transactions/logs', params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          const transactions = response.data as Transaction[];

          if (!transactions.length) {
            this.statusMessage = 'No transactions found';
            return;
          }

          this.totalTransactionHeader[2].value = transactions.length;

          transactions.forEach(transaction => {
            this.totalTransactionHeader[0].value += transaction.totalAmt || 0;
            this.totalTransactionHeader[1].value +=
              transaction.discountAmt || 0;
            this.totalTransactionHeader[3].value += transaction.pax || 0;
            this.totalTransactionHeader[4].value +=
              transaction.tripDistance || 0;
          });

          this.transactionLogs = transactions;
        },
        error: error => {
          console.error(error);
          this.isError = true;
          this.errorMessage = 'Error fetching transactions';
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  onPrint() {
    const data = {
      busData: this.busData,
      transactionLogs: this.transactionLogs,
      totalTransactionHeader: this.totalTransactionHeader,
    };
    const transformedData = environment.production
      ? encodeToBase64(JSON.stringify(data))
      : JSON.stringify(data);
    window.open(
      `#/print/transaction-logs?data=${transformedData}`,
      '_blank',
      'location=yes,height=800,width=1100,scrollbars=yes,status=yes'
    );
  }
}
