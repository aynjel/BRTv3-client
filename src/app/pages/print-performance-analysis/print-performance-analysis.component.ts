import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { decodeFromBase64 } from 'src/app/config/encryption';
import { assetsUrl, currentDate } from 'src/app/constants/constants';
import { BusDetails } from 'src/app/models/bus.model';
import { Zreading } from 'src/app/models/transactions.model';
import environment from 'src/environments/environment';

@Component({
  selector: 'app-print-performance-analysis',
  templateUrl: './print-performance-analysis.component.html',
  styleUrls: ['./print-performance-analysis.component.scss'],
})
export class PrintPerformanceAnalysisComponent {
  private activatedRoutes = inject(ActivatedRoute);

  readonly brtLogo = assetsUrl + 'BRT.png';
  currentDate = currentDate;

  busData: BusDetails;
  revenueOutlook = {
    cctvCount: 0,
    accuracyMultiply: 0,
    cctvCountAccuracy: 0,
    paoEnterAccuracy: 0,
    passengerCount: 0,
    cctvCountAccuracyLessPaoEnterCount: 0,
    posPassengerCountLess: 0,
    minimumFareMultiply: 0,
    totalCashCount: 0,
    totalNetCount: 0,
    resultingRevenueLeak: 0,
    lessExcess: 0,
    probableRevenueLeak: 0,
  };
  zreadingLogs: Zreading[];

  constructor() {
    const dataParams = this.activatedRoutes.snapshot.queryParams['data'];
    const data = environment.production
      ? decodeFromBase64(dataParams)
      : JSON.parse(decodeURIComponent(dataParams));
    console.log(data);
    this.revenueOutlook = {
      cctvCount: data.applied.cctvCount,
      accuracyMultiply: data.applied.accuracy,
      cctvCountAccuracy: data.applied.cctvCountAcc,
      paoEnterAccuracy: data.applied.lessPAOAcc,
      passengerCount: data.busData.totalPass,
      cctvCountAccuracyLessPaoEnterCount: data.applied.cctvCountAccLessPAO,
      posPassengerCountLess: data.applied.lessPOSPassCount,
      minimumFareMultiply: data.applied.minFare,
      totalCashCount: data.total.cashCount,
      totalNetCount: data.total.netAmt,
      resultingRevenueLeak: data.applied.resultRevLeak,
      lessExcess: data.total.difference,
      probableRevenueLeak: data.applied.probableRevLeak,
    };
    console.log(this.revenueOutlook);
    this.busData = data.busData as BusDetails;
    this.zreadingLogs = data.zreadingLogs as Zreading[];
  }

  onPrint() {
    window.print();
  }
}
