import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { getMerchant } from 'src/app/config/getMerchantData';
import { assetsUrl } from 'src/app/constants/constants';
import { Statistics, StatisticsData } from 'src/app/models/statistics.model';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit, OnChanges, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  @Input() dateStr?: string;

  // Loading Spinner
  isError: boolean = false;
  isLoading: boolean = true;
  errorMessage: string = '';

  statItem: Statistics[] = [
    {
      value: 0,
      label: 'Bus Count',
      currency: false,
      key: 'totalBus',
      imgUrl: assetsUrl + 'statistics_bus.svg',
    },
    {
      value: 0,
      label: 'POS Transaction Count',
      currency: false,
      key: 'posTrans',
      imgUrl: assetsUrl + 'statistics_pos.svg',
    },
    {
      value: 0.0,
      label: 'Passenger Count',
      currency: false,
      key: 'totalPass',
      imgUrl: assetsUrl + 'statistics_passenger.svg',
    },
    {
      value: 0.0,
      label: 'CCTV Camera Count',
      currency: false,
      key: 'cctvCount',
      imgUrl: assetsUrl + 'statistics_cctv.svg',
    },
    {
      value: 0,
      label: `Today's Sales`,
      currency: true,
      key: 'grossSales',
      imgUrl: assetsUrl + 'statistics_sales.svg',
    },
    {
      value: 0,
      label: 'Month to Date Sales',
      currency: true,
      key: 'monthlyGrossSales',
      imgUrl: assetsUrl + 'statistics_monthly_sales.svg',
    },
    {
      value: 0,
      label: `Today's Z Reading`,
      currency: true,
      key: 'zReading',
      imgUrl: assetsUrl + 'statistics_sales.svg',
    },
    {
      value: 0,
      label: 'Month to Date Z Reading',
      currency: true,
      key: 'monthlyZReading',
      imgUrl: assetsUrl + 'statistics_monthly_sales.svg',
    },
  ];

  constructor (private httpService: HttpService) { }

  ngOnInit(): void {
    this.getStatistics();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dateStr'].firstChange) return;
    this.getStatistics();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getStatistics() {
    this.isLoading = true;
    this.isError = false;

    if (!this.dateStr) {
      this.isError = true;
      this.errorMessage = 'Missing date!';
      return;
    }

    const params = {
      txnDate: this.dateStr,
    };

    this.httpService
      .get('dashboard/fetchStatistics', params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          const stats = response.data as StatisticsData;

          Object.keys(stats).forEach(item => {
            const findKey = this.statItem.find(stat => stat.key === item)!;

            if (findKey) {
              findKey.value = stats[item as keyof StatisticsData] || 0;
            }
          });

          const busKey = this.statItem.find(item => item.key === 'totalBus')!;

          busKey.value = stats.activeBus + stats.inactiveBus || 0;
        },
        error: (error: HttpErrorResponse) => {
          this.isError = true;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }
}
