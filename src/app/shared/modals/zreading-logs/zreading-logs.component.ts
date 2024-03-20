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
import { getMerchant } from 'src/app/config/getMerchantData';
import { BusDetails } from 'src/app/models/bus.model';
import { Zreading } from 'src/app/models/transactions.model';
import { HttpService } from 'src/app/services/http.service';
import { ModalService } from 'src/app/services/modal.service';
import environment from 'src/environments/environment';

@Component({
  selector: 'app-zreading-logs',
  templateUrl: './zreading-logs.component.html',
  styleUrls: ['./zreading-logs.component.scss'],
})
export class ZreadingLogsComponent implements OnChanges, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  @Input() busData?: BusDetails;

  totalZreadingCount: number = 0;
  zreadingLogs: Zreading[] = [];

  isLoading: boolean = true;
  isError: boolean = false;
  statusMessage: string = 'Fetching Zreading logs';
  errorMessage: string = '';

  constructor (private httpService: HttpService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['busData'].firstChange) return;
    if (!changes['busData'].currentValue) return;

    this.getZreadingLogs();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getZreadingLogs() {
    this.isError = false;
    this.isLoading = true;
    this.zreadingLogs = [];
    this.totalZreadingCount = 0;

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
      .get('transactions/zreading', params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          const zreadingLogs = response.data as Zreading[];

          if (!zreadingLogs.length) {
            this.isError = true;
            this.errorMessage = 'No Zreading logs found';
            return;
          }

          this.totalZreadingCount = zreadingLogs.length;
          this.zreadingLogs = zreadingLogs;
        },
        error: error => {
          console.error(error);
          this.isError = true;
          this.errorMessage =
            error.error?.message ||
            error.message ||
            'Error fetching Zreading logs';
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  printZReadingLogs() {
    const data = {
      zreadingLogs: this.zreadingLogs,
      busData: this.busData,
    };
    const transformedData = environment.production
      ? encodeToBase64(JSON.stringify(data))
      : JSON.stringify(data);
    window.open(
      `#/print/zreading-logs?data=${transformedData}`,
      '_blank',
      'location=yes,height=800,width=1100,scrollbars=yes,status=yes'
    );
  }
}
