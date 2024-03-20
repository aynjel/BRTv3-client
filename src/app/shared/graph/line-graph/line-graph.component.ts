import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js/dist/types/index';
import { BaseChartDirective } from 'ng2-charts';
import { Subject, takeUntil } from 'rxjs';
import { HourlyData } from 'src/app/models/hourly.model';
import { ChartService } from 'src/app/services/chart.service';

const color = {
  tranCount: '#104A69',
  paxCount: '#EBC075',
  cctvEnter: '#70CB96',
  cctvExit: '#9E2C2C',
};

@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.scss'],
})
export class LineGraphComponent implements OnInit, OnDestroy, OnChanges {
  private unsubscribe$ = new Subject<void>();
  private hourlyDataLabel: string[] = [];
  private hourlyTranCount: number[] = [];
  private hourlyPaxCount: number[] = [];
  private hourlyCctvEnter: number[] = [];
  private hourlyCctvExit: number[] = [];

  @ViewChild(BaseChartDirective) baseChart?: BaseChartDirective;

  @Input() hourlyData?: HourlyData[];
  @Input() statusMessage: string = '';
  @Input() displayLabel: boolean = true;

  @Output() isLoaded: EventEmitter<boolean> = new EventEmitter<boolean>(true);

  isLoading: boolean = true;
  isError: boolean = false;
  errorMessage: string = '';

  chartType: ChartType;
  chartOptions: ChartOptions;

  chartData: ChartData<'line'> = {
    labels: [],
    datasets: [],
  };

  constructor(private chartService: ChartService) {
    this.chartType = this.chartService.lineChart.type;
    this.chartOptions = this.chartService.lineChart.options;
  }

  ngOnInit(): void {
    if (this.chartOptions.plugins && this.chartOptions.plugins.legend)
      this.chartOptions.plugins.legend.display = this.displayLabel;

    this.isLoaded.emit(false);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (!changes['hourlyData']) return;
    if (
      !changes['hourlyData'].currentValue.length &&
      changes['hourlyData'].firstChange
    )
      return;
    // Apply updates based on checkboxes

    this.applyData();
  }

  // Update the line graph based on the HourlyData[]
  applyData() {
    this.resetValues();
    this.isLoading = false;
    this.isError = false;
    this.isLoaded.emit(true);

    if (!this.hourlyData?.length) {
      this.isError = true;
      this.errorMessage = 'No Data';

      this.chartData.labels = [];
      this.chartData.datasets = [];

      this.baseChart?.update();
      return;
    }

    for (const hourly of this.hourlyData) {
      let hourDisplay: number | string = Number(hourly.txnHour);

      switch (true) {
        case hourDisplay === 0:
          hourDisplay = '12 AM';
          break;
        case hourDisplay === 12:
          hourDisplay = '12 PM';
          break;
        case hourDisplay < 12:
          hourDisplay = `${hourDisplay} AM`;
          break;
        case hourDisplay > 12:
          hourDisplay = `${hourDisplay - 12} PM`;
          break;
        default:
      }

      this.hourlyDataLabel.push(hourDisplay as string);
      this.hourlyTranCount.push(hourly.tranCount);
      this.hourlyPaxCount.push(hourly.paxCount);
      this.hourlyCctvEnter.push(hourly.cctvEnter);
      this.hourlyCctvExit.push(hourly.cctvExit);

      this.chartData.labels = this.hourlyDataLabel;

      this.chartData.datasets = [
        {
          data: this.hourlyTranCount,
          label: 'Transaction Count',
          backgroundColor: color.tranCount,
          borderColor: color.tranCount,
          pointBackgroundColor: color.tranCount,
          pointBorderColor: color.tranCount,
        },
        {
          data: this.hourlyPaxCount,
          label: 'Passenger Count',
          backgroundColor: color.paxCount,
          borderColor: color.paxCount,
          pointBackgroundColor: color.paxCount,
          pointBorderColor: color.paxCount,
        },
        {
          data: this.hourlyCctvEnter,
          label: 'CCTV Enter',
          backgroundColor: color.cctvEnter,
          borderColor: color.cctvEnter,
          pointBackgroundColor: color.cctvEnter,
          pointBorderColor: color.cctvEnter,
        },
        {
          data: this.hourlyCctvExit,
          label: 'CCTV Exit',
          backgroundColor: color.cctvExit,
          borderColor: color.cctvExit,
          pointBackgroundColor: color.cctvExit,
          pointBorderColor: color.cctvExit,
        },
      ];

      this.isLoaded.emit(false);
      this.baseChart?.update();
    }
  }

  private resetValues() {
    this.hourlyDataLabel = [];
    this.hourlyTranCount = [];
    this.hourlyPaxCount = [];
    this.hourlyCctvEnter = [];
    this.hourlyCctvExit = [];
  }
}
