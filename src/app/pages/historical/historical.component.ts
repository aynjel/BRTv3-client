import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { HistoricalCalendarService } from 'src/app/services/historical-calendar.service';
import { ModalService } from 'src/app/services/modal.service';
import { HttpService } from 'src/app/services/http.service';
import { storage } from 'src/app/config/storage';
import { Merchant } from 'src/app/models/merchant.model';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { currentDate } from 'src/app/constants/constants';

enum CalendarViewEnum {
  DAILY = 'daily',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

interface HistoricalData {
  ID: number;
  TxnDate: string;
  NetAmt: number;
}

export interface DateDTO {
  month: string;
  year: number;
  day: number;
  sales: number;
  checked?: boolean;
}

@Component({
  selector: 'app-historical',
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.scss'],
})
export class HistoricalComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();

  isLoading = true;
  isError: boolean = false;
  errorMessage: string = '';

  date = currentDate;

  $year = signal(this.date.getFullYear());
  $month = signal(this.date.getMonth() + 1);
  $day = signal(this.date.getDate());

  year = this.date.getFullYear();
  month = this.date.getMonth() + 1;
  day = this.date.getDate();
  daysInMonth = this.hcService.getDaysInMonth(this.month, this.year);
  firstDayOfMonth = this.hcService.getFirstDayOfMonth(this.month, this.year);
  lastDayOfMonth = this.hcService.getLastDayOfMonth(this.month, this.year);
  monthName = this.hcService.getMonthName(this.month);
  dayName = this.hcService.getDayName(this.date.getDay());

  dailySales: { [key: number]: DateDTO } = {};

  dates = this.hcService.arrangeDays(this.firstDayOfMonth, this.daysInMonth);
  days: string[] = [];
  months: string[] = [];
  years: number[] = Array.from({ length: 100 }, (_, i) => this.year - i);

  $selectedCalendarView = signal(CalendarViewEnum.DAILY);

  dateStr = signal(`${this.year}-${this.month.toString().padStart(2, '0')}-01`);

  historicalData: HistoricalData[] = [];
  monthlySales = 0;

  constructor(
    private httpService: HttpService,
    private hcService: HistoricalCalendarService,
    private modal: ModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.months = this.hcService.getMonthNames();
    this.days = this.hcService.getDayNames();
    this.loadHistoricalData();
  }

  ngOnDestroy() {
    this.unsubscribe$.next(this.unsubscribe$.complete());
  }

  loadHistoricalData() {
    this.isLoading = true;
    this.monthlySales = 0;
    const params = {
      txnDate: `${this.year}-${this.month.toString().padStart(2, '0')}-01`,
    };

    this.httpService
      .get('historical/monthlySales', params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: res => {
          const hData = res.data as HistoricalData[];

          this.dailySales = {};

          for (const data of hData) {
            const date = new Date(data.TxnDate);
            const day = date.getDate();
            const month = this.months[date.getMonth()];
            const year = date.getFullYear();

            if (this.dailySales[day]) {
              this.dailySales[day].sales += data.NetAmt;
            } else {
              this.dailySales[day] = {
                month,
                year,
                day,
                sales: data.NetAmt,
                checked: true,
              };
            }
          }

          this.monthlySales = this.calculateTotalMonthlySales();
          this.isLoading = false;
        },
        error: err => {
          console.error(err);
          this.isLoading = false;
          this.isError = true;
          this.errorMessage =
            err.error?.message ||
            err.message ||
            'Error fetching historical data';
        },
      });
  }

  toggleCheckboxToUpdateTotalMonthlySales(event: any, date: number) {
    this.dailySales[date].checked = event.target.checked;
    this.monthlySales = this.calculateTotalMonthlySales();
  }

  calculateTotalMonthlySales(): number {
    let total = 0;
    for (const date in this.dailySales) {
      if (this.dailySales[date].checked) {
        total += this.dailySales[date].sales;
      }
    }
    return total;
  }

  viewStatistics(date: number) {
    const selectedDate = `${this.year}-${this.month
      .toString()
      .padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
    this.dateStr.set(selectedDate);
    this.modal.showModal('statisticsSummary');
  }

  viewAnalytics(date: number) {
    const selectedDate = `${this.year}-${this.month
      .toString()
      .padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
    this.router.navigate([`/historical/${selectedDate}/analytics`]);
  }

  changeView() {
    this.monthlySales = 0;
    // update view
    switch (this.$selectedCalendarView()) {
      case 'daily':
        this.$selectedCalendarView.set(CalendarViewEnum.MONTHLY);
        break;
      case 'yearly':
        this.$selectedCalendarView.set(CalendarViewEnum.DAILY);
        break;
      case 'monthly':
        this.$selectedCalendarView.set(CalendarViewEnum.YEARLY);
        break;
      default:
        break;
    }

    // update data
    switch (this.$selectedCalendarView()) {
      case 'daily':
        this.daysInMonth = this.hcService.getDaysInMonth(this.month, this.year);
        this.firstDayOfMonth = this.hcService.getFirstDayOfMonth(
          this.month,
          this.year
        );
        this.lastDayOfMonth = this.hcService.getLastDayOfMonth(
          this.month,
          this.year
        );
        this.monthName = this.hcService.getMonthName(this.month);
        this.dates = this.hcService.arrangeDays(
          this.firstDayOfMonth,
          this.daysInMonth
        );
        this.loadHistoricalData();
        break;
      case 'monthly':
        this.years = Array.from({ length: 100 }, (_, i) => this.year - i);
        break;
      case 'yearly':
        break;
      default:
        break;
    }
  }

  navigate(direction: string) {
    switch (this.$selectedCalendarView()) {
      case 'daily':
        this.navigateByMonth(direction);
        break;
      case 'yearly':
        this.navigateByYear(direction);
        break;
      default:
        break;
    }
  }

  navigateByMonth(direction: string) {
    switch (direction) {
      case 'prev':
        this.month--;
        if (this.month < 1) {
          this.month = 12;
          this.year--;
        }
        break;
      case 'next':
        this.month++;
        if (this.month > 12) {
          this.month = 1;
          this.year++;
        }
        break;
      default:
        break;
    }

    this.daysInMonth = this.hcService.getDaysInMonth(this.month, this.year);
    this.firstDayOfMonth = this.hcService.getFirstDayOfMonth(
      this.month,
      this.year
    );
    this.lastDayOfMonth = this.hcService.getLastDayOfMonth(
      this.month,
      this.year
    );
    this.monthName = this.hcService.getMonthName(this.month);
    this.dates = this.hcService.arrangeDays(
      this.firstDayOfMonth,
      this.daysInMonth
    );
    this.loadHistoricalData();
  }

  navigateByYear(direction: string) {
    switch (direction) {
      case 'prev':
        this.year--;
        break;
      case 'next':
        this.year++;
        break;
      default:
        break;
    }

    this.years = Array.from({ length: 100 }, (_, i) => this.year - i);
  }

  navigateToMonthlyView(month: string) {
    console.log('Navigating to', month, this.year);
    this.month = this.months.indexOf(month) + 1;
    this.daysInMonth = this.hcService.getDaysInMonth(this.month, this.year);
    this.firstDayOfMonth = this.hcService.getFirstDayOfMonth(
      this.month,
      this.year
    );
    this.lastDayOfMonth = this.hcService.getLastDayOfMonth(
      this.month,
      this.year
    );
    this.monthName = this.hcService.getMonthName(this.month);
    this.dates = this.hcService.arrangeDays(
      this.firstDayOfMonth,
      this.daysInMonth
    );

    this.$selectedCalendarView.set(CalendarViewEnum.DAILY);

    this.loadHistoricalData();
  }

  navigateToYearlyView(year: number) {
    console.log('Navigating to', year);
    this.year = year;
    this.years = Array.from({ length: 100 }, (_, i) => this.year - i);

    this.$selectedCalendarView.set(CalendarViewEnum.MONTHLY);
  }

  navigateTo(url: string, date: number) {
    const year = this.year;
    const month = this.month.toString().padStart(2, '0');
    const day = date.toString().padStart(2, '0');
    this.router.navigate(['/historical', `${year}-${month}-${day}`]);
  }

  viewTimelapsed(date: number) {
    const year = this.year;
    const month = this.month.toString().padStart(2, '0');
    const day = date.toString().padStart(2, '0');
    const fullDate = `${year}-${month}-${day}`;
    this.router.navigate([`/historical/${fullDate}/timelapse`]);
  }
}
