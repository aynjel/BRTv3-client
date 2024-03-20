import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BusDetails } from 'src/app/models/bus.model';
import { HistoricalData } from 'src/app/models/historicalData.model';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { NumberFormatPipe } from 'src/app/pipes/number-format.pipe';
import { ModalService } from 'src/app/services/modal.service';

interface LabelDetails {
  label: string;
  value?: any;
}

@Component({
  providers: [NumberFormatPipe, CurrencyFormatPipe],
  selector: 'app-imei-analytics-details',
  templateUrl: './imei-analytics-details.component.html',
  styleUrls: ['./imei-analytics-details.component.scss'],
})
export class ImeiAnalyticsDetailsComponent implements OnInit, OnChanges {
  @Input() imeiDetails?: HistoricalData;

  labelDetails: LabelDetails[] = [];
  constructor(
    private modalService: ModalService,
    private numberFormatPipe: NumberFormatPipe,
    private currencyFormatPipe: CurrencyFormatPipe
  ) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.imeiDetails) {
      this.labelDetails = [
        { label: 'IMEI', value: this.imeiDetails.IMEI },
        { label: 'Route', value: this.imeiDetails.routeCode },
        { label: 'PAO', value: this.imeiDetails.PAO },
        {
          label: 'POS Tran AMT',
          value: this.currencyFormatPipe.transform(this.imeiDetails.grossSales),
        },
        {
          label: 'POS Tran Count',
          value: this.numberFormatPipe.transform(this.imeiDetails.tranCount),
        },
        {
          label: 'POS Pass Count',
          value: this.numberFormatPipe.transform(this.imeiDetails.totalPass),
        },
        {
          label: 'ZRead Tran Count',
          value: this.numberFormatPipe.transform(this.imeiDetails.grossCount),
        },
        {
          label: 'ZRead Pass Count',
          value: this.numberFormatPipe.transform(this.imeiDetails.passCount),
        },
        {
          label: 'Cash Count',
          value: this.numberFormatPipe.transform(this.imeiDetails.cashCount),
        },
        {
          label: 'ZRead Net Amount',
          value: this.currencyFormatPipe.transform(this.imeiDetails.netAmt),
        },
        {
          label: 'Difference (Cash - ZRead)',
          value: this.currencyFormatPipe.transform(
            this.imeiDetails.cashCount - this.imeiDetails.netAmt
          ),
        },
        {
          label: 'CCTV Count',
          value: this.numberFormatPipe.transform(this.imeiDetails.cctvCount),
        },
      ];
    }
  }

  closeStatisticsSummaryModal() {
    this.modalService.close('imeiDetails');
  }
}
