import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js/dist/types/index';
import { BaseChartDirective } from 'ng2-charts';
import { Subject, takeUntil } from 'rxjs';
import { BusGeneral } from 'src/app/models/bus.model';
import { RouteStops } from 'src/app/models/routeStops.model';
import { ChartService } from 'src/app/services/chart.service';
import { HttpService } from 'src/app/services/http.service';

const color = {
  tranCount: '#36a2eb80',
  paxCount: '#ff9f40b3'
};

@Component({
  selector: 'app-bar-graph',
  templateUrl: './bar-graph.component.html',
  styleUrls: ['./bar-graph.component.scss']
})
export class BarGraphComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private routeStops: string[] = [];
  private paxCount: number[] = [];
  private tranCount: number[] = [];

  @ViewChild(BaseChartDirective) baseChart?: BaseChartDirective;

  @Input() busData?: BusGeneral;
  @Input() txnDate: string = '';
  @Input() statusMessage: string = '';

  @Output() isLoaded: EventEmitter<boolean> = new EventEmitter<boolean>(true);

  isLoading: boolean = true;
  isError: boolean = false;
  errorMessage: string = '';

  chartType: ChartType;
  chartOptions: ChartOptions;

  chartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  // chartData: ChartData<'bar'> = {
  //   labels: ['CTU', 'UC', 'STC', 'USC', 'USJR', 'UV', 'UP'],
  //   datasets: [
  //     {
  //       data: [65, 59, 80, 81, 56, 55, 40],
  //       label: 'Sales Revenue',
  //       backgroundColor: new Array(7).fill(null).map((_) => generateRandomColor())
  //     },
  //   ],
  // };

  constructor (private chartService: ChartService, private httpService: HttpService) {
    this.chartType = this.chartService.barChart.type;
    this.chartOptions = chartService.barChart.options;
  }

  ngOnInit(): void {
    this.isLoaded.emit(false);
    this.getGraphData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getGraphData() {
    this.isLoading = true;
    this.isError = false;

    if (!this.txnDate) {
      this.isError = true;
      this.errorMessage = 'No Date provided';
      return;
    }

    this.isLoaded.emit(true);

    let params = {
      txnDate: this.txnDate,
      direction: '0',
    } as any;

    if (this.busData) params = {
      ...params,
      ID: this.busData.ID,
      IMEI: this.busData.IMEI,
      branchID: this.busData.branchID,
      routeCode: this.busData.routeCode,
      txnDate: this.busData.txnDate
    };

    this.httpService.get('graph/stops', params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          const data = response.data as RouteStops[];

          if (!data.length) {
            this.isError = true;
            this.errorMessage = 'No Route Stops found';
            return;
          }

          data.forEach(item => {
            this.routeStops.push(item.stationCode);
            this.paxCount.push(item.paxCount);
            this.tranCount.push(item.tranCount);
          });

          this.chartData.labels = this.routeStops;
          this.chartData.datasets = [
            {
              data: this.tranCount,
              label: 'Transaction Count',
              backgroundColor: color.tranCount,
              borderColor: color.tranCount,
            },
            {
              data: this.paxCount,
              label: 'Passenger Count',
              backgroundColor: color.paxCount,
              borderColor: color.paxCount,
            }
          ];

          this.baseChart?.update();
        }, error: (error) => {
          console.error(error);
          this.isError = true;
          this.errorMessage =   'Error fetching Route stops';
        }, complete: () => {
          this.isLoading = false;
          this.isLoaded.emit(false);
        }
      });
  }
}
