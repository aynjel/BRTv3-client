import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js/dist/types/index';
import { BaseChartDirective } from 'ng2-charts';
import { Subject, takeUntil } from 'rxjs';
import { getMerchant } from 'src/app/config/getMerchantData';
import { generateRandomColor } from 'src/app/config/randomColor';
import { currentDate } from 'src/app/constants/constants';
import { MonthlyRoutes } from 'src/app/models/routes.model';
import { ChartService } from 'src/app/services/chart.service';
import { HttpService } from 'src/app/services/http.service';

const routeMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

@Component({
  selector: 'app-donut-graph',
  templateUrl: './donut-graph.component.html',
  styleUrls: ['./donut-graph.component.scss']
})
export class DonutGraphComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  @ViewChild(BaseChartDirective) baseChart?: BaseChartDirective;

  currentMonth: string = routeMonth[currentDate.getMonth()];
  monthlySales: number = 0;

  statusMessage: string = `Fetching ${this.currentMonth} Sales`;
  isLoading: boolean = true;
  isError: boolean = false;
  errorMessage: string = '';

  chartType: ChartType;
  chartOptions: ChartOptions;

  chartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [],
  };

  constructor (private chartService: ChartService, private httpService: HttpService) {
    this.chartType = this.chartService.doughnutChart.type;
    this.chartOptions = this.chartService.doughnutChart.options;
  }

  ngOnInit(): void {
    this.getMonthlyRouteSales(currentDate.getMonth());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getMonthlyRouteSales(month: number) {
    this.isLoading = true;
    this.isError = false;

    this.statusMessage = `Fetching ${routeMonth[month]} Sales`;

    const params = {
      month: month
    };

    this.httpService.get('dashboard/routeMonthlySales', params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          const data = response.data as MonthlyRoutes[];

          if (!data.length) {
            this.isError = true;
            this.errorMessage = 'No Data';
            return;
          }

          this.monthlySales = data.reduce((acc, curr) => acc += curr.grossSales, 0);

          this.chartData.labels = data.map(item => item.routeCode);
          this.chartData.datasets = [{ data: data.map(item => item.grossSales), backgroundColor: new Array(data.length).fill(null).map((_) => generateRandomColor()) }];

          this.baseChart?.update();
        }, error: (error) => {
          console.error(error);
          this.isError = true;
          this.errorMessage = error.error?.message || error.message || 'Error Fetching Monthly Sales';
        }, complete: () => {
          this.isLoading = false;
        }
      });
  }

  nextMonth() {
    // if (this.isLoading) return;

    const current = routeMonth.indexOf(this.currentMonth);
    const next = routeMonth.indexOf(this.currentMonth) + 1;
    if (current === 11 || next > currentDate.getMonth()) return;

    this.currentMonth = routeMonth[next];
    this.getMonthlyRouteSales(next);
  }

  prevMonth() {
    // if (this.isLoading) return;

    const current = routeMonth.indexOf(this.currentMonth);
    const prev = routeMonth.indexOf(this.currentMonth) - 1;
    if (current === 0) return;

    this.currentMonth = routeMonth[prev];
    this.getMonthlyRouteSales(prev);
  }
}
