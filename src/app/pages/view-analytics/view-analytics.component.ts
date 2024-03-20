import { Component, OnDestroy, computed, effect, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusDetails, BusGeneral } from 'src/app/models/bus.model';
import { ModalService } from 'src/app/services/modal.service';
import { Subject, takeUntil } from 'rxjs';
import { HistoricalData } from 'src/app/models/historicalData.model';
import { HourlyData } from 'src/app/models/hourly.model';
import { HttpService } from 'src/app/services/http.service';
import { dateRegex } from 'src/app/constants/constants';
import {
  AnalyticsTableEnumFilter,
  DataAnalyticsService,
} from '../../services/data-analytics.service';

@Component({
  selector: 'app-view-analytics',
  templateUrl: './view-analytics.component.html',
  styleUrls: ['./view-analytics.component.scss'],
})
export class ViewAnalyticsComponent implements OnDestroy {
  private unsubscribe$ = new Subject<void>();

  historicalDate: string = '';

  readonly tableNav = [
    AnalyticsTableEnumFilter.BUSES,
    AnalyticsTableEnumFilter.ROUTES,
    AnalyticsTableEnumFilter.PAO,
  ];

  searchQuery = signal('');

  historicalTableData = signal<HistoricalData[]>([]);

  filteredTableData = computed(() => {
    const searchQuery = this.searchQuery().toLowerCase();
    const searchQueryRegex = new RegExp(searchQuery, 'i');
    return this.historicalTableData().filter(data => {
      return (
        searchQueryRegex.test(data.IMEI) ||
        searchQueryRegex.test(data.routeCode) ||
        searchQueryRegex.test(data.PAO) ||
        searchQueryRegex.test(data.branchID)
      );
    });
  });

  rowChecked = signal(true);
  someChecked = signal(false);

  hourlyData = signal<HourlyData[]>([]);
  selectedHourlyData!: HourlyData;

  busData?: BusGeneral;

  isLoading: boolean = true;
  isError: boolean = false;
  statusMessage: string = 'Fetching Historical data';
  errorMessage: string = '';

  selectedBusTransaction?: BusDetails;
  selectedBusZreading?: BusDetails;
  selectedEntry?: BusDetails;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
    private modal: ModalService,
    public dataAnalyticsService: DataAnalyticsService
  ) {
    this.activatedRoute.params.subscribe((params: any) => {
      if (!dateRegex.test(params['date'])) {
        this.router.navigate(['/historical']);
        return;
      }

      this.historicalDate = params['date'];
    });

    effect(() => {
      this.getHistoricalRecords();
    });
  }
  modalData: any;

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  getHistoricalRecords() {
    this.isError = false;
    this.isLoading = true;

    this.httpService
      .get('historical/records', {
        date: this.historicalDate,
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          const records = response.data as HistoricalData[];

          if (!records.length) {
            this.isError = true;
            this.errorMessage = 'No data';
            return;
          }

          this.dataAnalyticsService.setTableData({
            data: records,
            filter: AnalyticsTableEnumFilter.BUSES,
          });

          this.hourlyData.set(this.getHourlyData(records));
          this.historicalTableData.set(records);
        },
        error: error => {
          console.error(error);
          this.isError = true;
          this.errorMessage = 'Error fetching Historical Data';
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  // get hourly data based on filtered data
  getHourlyData(data: HistoricalData[]): HourlyData[] {
    const hourlyData: HourlyData[] = data.reduce((acc: HourlyData[], curr) => {
      for (const hourly of curr.hourlyData) {
        const existing = acc.find(
          hour => Number(hour.txnHour) === Number(hourly.txnHour)
        );

        if (!existing) {
          acc.push({
            txnHour: hourly.txnHour,
            cctvEnter: hourly.cctvEnter,
            cctvExit: hourly.cctvExit,
            paxCount: hourly.paxCount,
            tranCount: hourly.tranCount,
            txnDate: hourly.txnDate,
          });
        } else {
          existing.cctvEnter += hourly.cctvEnter;
          existing.cctvExit += hourly.cctvExit;
          existing.paxCount += hourly.paxCount;
          existing.tranCount += hourly.tranCount;
        }
      }

      return acc.sort((a, b) => Number(a.txnHour) - Number(b.txnHour));
    }, []);

    return hourlyData;
  }

  setActiveTable(value: AnalyticsTableEnumFilter) {
    this.dataAnalyticsService.setTableFilter(value);
    console.log(
      this.dataAnalyticsService.activeTable(),
      this.historicalTableData()
    );
  }

  viewDetails(selectedTable: string) {
    this.router.navigate([
      'historical',
      this.historicalDate,
      selectedTable.toLocaleLowerCase(),
    ]);
  }

  navigateBack() {
    this.router.navigate(['/historical']);
  }

  showModal(type: string, data: any) {
    this.modalData = data;
    switch (type) {
      case 'imei':
        this.modal.showModal('imeiDetails');
        break;
      case 'transactions':
        this.selectedBusTransaction = data;
        this.modal.showModal('transactions');
        break;
      case 'cashCount':
        this.modal.showModal('cashCountDetails');
        break;
      case 'zReadNetAmount':
        this.selectedBusZreading = data;
        this.modal.showModal('zreading');
        break;
      case 'remarks':
        this.modal.showModal('remarksAnalytics');
        break;
      default:
        break;
    }
  }

  toggleCheckbox(data: HistoricalData) {
    data.checked = !data.checked;
    this.rowChecked.set(this.historicalTableData().every(data => data.checked));
    this.someChecked.set(
      this.historicalTableData().some(data => data.checked) &&
        !this.historicalTableData().every(data => data.checked)
    );

    // get the checked data and set it to the hourly data
    const checkedData = this.historicalTableData().filter(data => data.checked);
    this.hourlyData.set(this.getHourlyData(checkedData));
  }

  toggleAllCheckboxes(event: Event) {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    this.historicalTableData().forEach(data => {
      data.checked = checked;
    });
    this.rowChecked.set(checked);
    this.someChecked.set(false);

    // get the checked data and set it to the hourly data
    const checkedData = this.historicalTableData().filter(data => data.checked);
    this.hourlyData.set(this.getHourlyData(checkedData));
  }

  search(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.searchQuery.set(value);
  }
}
