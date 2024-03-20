import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { currencyFormat } from 'src/app/config/currencyFormat';
import { encodeToBase64 } from 'src/app/config/encryption';
import { BusDetails, BusGeneral } from 'src/app/models/bus.model';
import { ZreadingNotes } from 'src/app/models/transactions.model';
import { HttpService } from 'src/app/services/http.service';
import environment from 'src/environments/environment';

// generates percentage by 5% up to 100%
const percentages = Array.from({ length: 20 }, (_, index) => (index + 1) * 5);

type cctvType = 'enter' | 'exit' | 'avg';
type selectCctvType = {
  key: cctvType;
  name: string;
  value: number;
};
type cctv = {
  cctvEnter: number;
  cctvExit: number;
};
@Component({
  selector: 'app-performance-analysis',
  templateUrl: './performance-analysis.component.html',
  styleUrls: ['./performance-analysis.component.scss'],
})
export class PerformanceAnalysisComponent implements OnChanges, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  @Input() busData?: BusDetails;

  percentages = percentages;

  isLoading: boolean = true;
  isError: boolean = false;
  statusMessage: string = 'Fetching Analysis';
  errorMessage: string = '';

  defaultMinFare: number = 0;
  revenueLeak: number = 0;

  // ----    Revenue Outlook    ----
  // Configuration
  settings = {
    accuracy: percentages[15] as number, // 80% default
    paoEnterCount: percentages[1] as number, // 10% default
    cctvSelect: [
      {
        key: 'enter',
        name: 'Enter',
        value: 0,
      },
      {
        key: 'exit',
        name: 'Exit',
        value: 0,
      },
      {
        key: 'avg',
        name: 'Average',
        value: 0,
      },
    ] as selectCctvType[],
    cctvCount: 0,
    minFare: 0,
  };

  selectedCctv: selectCctvType = this.settings.cctvSelect[0];

  // Results to display
  applied = {
    cctvLabel: this.selectedCctv.name,
    cctvCount: this.selectedCctv.value,
    accuracy: 0,
    cctvCountAcc: 0,
    lessPAOAcc: 0,
    cctvCountAccLessPAO: 0,
    lessPOSPassCount: 0,
    possibleNoIssuance: 0,
    minFare: 0,
    resultRevLeak: 0,
    excessOrShort: 0,
    probableRevLeak: 0,
  };

  reportList = [
    {
      label: `CCTV Count`,
      value: this.applied.cctvCount,
      currency: false,
      percent: false,
    },
    {
      label: 'Multiply: Accuracy (%)',
      value: this.applied.accuracy,
      currency: false,
      percent: true,
    },
    {
      label: 'CCTV Count Accuracy',
      value: this.applied.cctvCountAcc,
      currency: false,
      percent: false,
    },
    {
      label: 'Less: PAO Enter Accuracy (%)',
      value: this.applied.lessPAOAcc,
      currency: false,
      percent: true,
    },
    {
      label: 'CCTV Count Accuracy \nless PAO Enter Count',
      value: this.applied.cctvCountAccLessPAO,
      currency: false,
      percent: false,
    },
    {
      label: 'Less: POS Passenger Count',
      value: this.applied.lessPOSPassCount,
      currency: false,
      percent: false,
    },
    {
      label: 'Possible Passengers with No Issuance',
      value: this.applied.possibleNoIssuance,
      currency: false,
      percent: false,
    },
    {
      label: 'Multiply Minimum Fare',
      value: this.applied.minFare,
      currency: true,
      percent: false,
    },
    {
      label: 'Resulting Revenue Leak (Est.)',
      value: this.applied.resultRevLeak,
      currency: true,
      percent: false,
    },
    {
      label: 'Add Short or Less Excess',
      value: this.applied.excessOrShort,
      currency: true,
      percent: false,
    },
  ];

  // ----    Zreading Logs    ----
  totalZreading: number = 0;
  zreadingLogs: ZreadingNotes[] = [];
  total = {
    cashCount: 0,
    netAmt: 0,
    difference: 0,
  };

  constructor(private httpService: HttpService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['busData'].firstChange) return;
    if (!changes['busData'].currentValue) return;

    this.selectedCctv = this.settings.cctvSelect[0];
    this.restoreDefaults();
    this.getAnalysis();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getAnalysis() {
    this.resetValues();

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
      .get('transactions/analysis', params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          const analyses = response.data.analyses as ZreadingNotes[];
          const cctv = response.data.cctvCount as cctv;
          this.defaultMinFare =
            this.settings.minFare =
            this.applied.minFare =
              response.data.fares || 0;

          this.settings.cctvSelect[0].value = cctv.cctvEnter;
          this.settings.cctvSelect[1].value = cctv.cctvExit;
          this.settings.cctvSelect[2].value =
            (cctv.cctvEnter + cctv.cctvExit) / 2;

          if (!analyses.length) {
            this.isError = true;
            this.errorMessage = 'No Zreading logs found';
          } else {
            this.zreadingLogs = analyses;
            this.totalZreading = analyses.length;

            analyses.forEach(analysis => {
              this.total.cashCount += analysis.cashCount;
              this.total.netAmt += analysis.NetAmount;
            });

            this.total.difference = this.total.cashCount - this.total.netAmt;
          }

          this.applyChanges();
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

  // Change cctv value to update the count
  selectCctv(key: selectCctvType) {
    this.selectedCctv = key;
    this.settings.cctvCount = key.value;
  }

  // Update the changes set from the configuration
  applyChanges() {
    const accuracy = Number(this.settings.accuracy);
    const paoEnter = Number(this.settings.paoEnterCount);
    const minFare = Number(this.settings.minFare) || 0;
    const cctvCount = Number(this.selectedCctv.value);

    this.applied.accuracy = accuracy;
    this.applied.lessPAOAcc = paoEnter;
    this.applied.minFare = minFare;
    this.applied.cctvCount = cctvCount;
    this.applied.cctvLabel = this.selectedCctv.name;

    this.updateReport();
  }

  // Resets the setting values back to default
  restoreDefaults() {
    this.settings.accuracy = percentages[15];
    this.settings.paoEnterCount = percentages[1];
    this.settings.minFare = this.defaultMinFare;

    this.applied.accuracy = this.settings.accuracy;
    this.applied.lessPAOAcc = this.settings.paoEnterCount;
    this.applied.minFare = this.settings.minFare;

    this.updateReport();
  }

  // Resets the values back to its defaults
  private resetValues() {
    this.isError = false;
    this.isLoading = true;
    this.reportList.forEach(report => (report.value = 0));
    this.reportList[0].label = 'CCTV Count';
    this.reportList[9].label = 'Add Short or Less Excess';
    this.total.cashCount = 0;
    this.total.netAmt = 0;
    this.total.difference = 0;
    this.revenueLeak = 0;
    this.zreadingLogs = [];
  }

  // Updates values based on the configuration
  private updateReport() {
    const cctvCount = this.applied.cctvCount;
    const cctvAccuracy = this.applied.accuracy;
    const paoEnterAccuracy = this.applied.lessPAOAcc;

    const cctvCountAccuracy = cctvCount * (cctvAccuracy / 100);
    const cctvCountAccuracyLessPAO =
      ((100 - paoEnterAccuracy) / 100) * cctvCountAccuracy;
    const passCount = this.busData?.totalPass || 0;
    const possiblePassengers = cctvCountAccuracyLessPAO - passCount;

    const minFare = this.applied.minFare;
    const resulting = minFare * possiblePassengers;

    const excessOrShortage = -this.total.difference; // get from zreading data difference

    this.reportList[0].label = `CCTV Count (${this.applied.cctvLabel})`;
    this.reportList[0].value = cctvCount; // cctv count
    this.reportList[1].value = cctvAccuracy; // cctv accuracy

    this.reportList[2].value = cctvCountAccuracy; // cctv count accuracy
    this.reportList[3].value = paoEnterAccuracy; // less pao enter accuracy

    this.reportList[4].value = cctvCountAccuracyLessPAO; // cctv count accuracy less pao enter count
    this.reportList[5].value = passCount; // less pos passenger count

    this.reportList[6].value = possiblePassengers; // possible passenger with no issuance
    this.reportList[7].value = this.applied.minFare; // minimum fare

    this.reportList[8].value = resulting; // resulting revenue leak
    this.reportList[9].value = excessOrShortage; // less excess or add short

    this.reportList[9].label =
      excessOrShortage < -1 ? 'Less Excess' : 'Add Short';

    this.revenueLeak = resulting + excessOrShortage;
  }

  onPrint(): void {
    const data = {
      busData: this.busData,
      zreadingLogs: this.zreadingLogs,
      total: this.total,
      revenueLeak: this.revenueLeak,
      applied: this.applied,
    };
    const transformedData = environment.production
      ? encodeToBase64(JSON.stringify(data))
      : JSON.stringify(data);
    console.log(transformedData);
    window.open(
      `#/print/performance-analysis?data=${transformedData}`,
      '_blank',
      'location=yes,height=800,width=1100,scrollbars=yes,status=yes'
    );
  }
}
