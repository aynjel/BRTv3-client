import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BusDetails, BusRoutes } from 'src/app/models/bus.model';
import { Statistics } from 'src/app/models/statistics.model';

@Component({
  selector: 'app-bus-summary',
  templateUrl: './bus-summary.component.html',
  styleUrls: ['./bus-summary.component.scss']
})
export class BusSummaryComponent implements OnChanges {

  private revenueCount: number = 0;

  @Input() busRoutes: BusRoutes[] = [];
  @Input() updateList: any;

  busStatItem: Statistics[] = [
    {
      value: 0,
      label: 'POS Txn Count',
      currency: false,
      key: 'posTrans'
    },
    {
      value: 0,
      label: 'POS Pass Count',
      currency: false,
      key: 'totalPass'
    },
    {
      value: 0,
      label: 'POS Sales',
      currency: true,
      key: 'grossSales'
    },
    {
      value: 0,
      label: 'CCTV Count',
      currency: false,
      key: 'cctvCount'
    },
    {
      value: 0,
      label: 'Average Revenue/Hour',
      currency: true,
      key: 'revenue'
    },
    {
      value: 0,
      label: 'Zread Txn Count',
      currency: false,
      key: 'grossCount'
    },
    {
      value: 0,
      label: 'Zread Pass Count',
      currency: false,
      key: 'passCount'
    },
    {
      value: 0,
      label: 'Zread Net Amt',
      currency: true,
      key: 'netAmt'
    },
    {
      value: 0,
      label: 'Zread Gross Amt',
      currency: true,
      key: 'zReading'
    },
  ];

  constructor () { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes) return;

    this.calculateTotal();
  }

  private calculateTotal() {
    this.revenueCount = 0;
    this.busStatItem.forEach(item => item.value = 0);

    this.busRoutes.forEach(busRoute => {
      busRoute.buses.forEach(bus => {
        if (!bus.checked) return;

        if (bus.revenueCount) this.revenueCount++;

        this.busStatItem[0].value += bus.tranCount; // POS Tran Count
        this.busStatItem[1].value += bus.totalPass; // POS Pass Count
        this.busStatItem[2].value += bus.grossSales; // POS Sales

        this.busStatItem[3].value += bus.cctvCount; // CCTV Count
        this.busStatItem[4].value += bus.averageRev || 0; // Average revenue
        this.busStatItem[5].value += bus.grossCount; // Zread Gross Count

        this.busStatItem[6].value += bus.passCount; // Zread Pass Count
        this.busStatItem[7].value += bus.netAmt; // Zread Net
        this.busStatItem[8].value += bus.grossAmt; // Zread Gross Amt
      });
    });

    this.busStatItem[4].value /= this.revenueCount;
  }
}
