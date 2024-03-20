import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CashCountDetails } from 'src/app/models/cashCount.model';

@Component({
  selector: 'app-cash-count-analytics-details',
  templateUrl: './cash-count-analytics-details.component.html',
  styleUrls: ['./cash-count-analytics-details.component.scss'],
})
export class CashCountAnalyticsDetailsComponent implements OnChanges {
  @Input() cashCountDetails?: CashCountDetails;

  dataEntryForm: FormGroup;

  constructor(private modal: ModalService, private fb: FormBuilder) {
    this.dataEntryForm = this.fb.group({
      dateFrom: [''],
      timeIn: ['', Validators.required],
      timeOut: ['', Validators.required],
      IMEI: ['', Validators.required],
      routeCode: ['', Validators.required],
      PAO: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      odometerStart: ['', Validators.required],
      odometerEnd: ['', Validators.required],
      fuelConsumption: ['', Validators.required],
      amount: ['', Validators.required],
    });
  }

  ngOnChanges() {
    this.dataEntryForm.patchValue({
      dateFrom:
        this.cashCountDetails?.dateTimeIn.split('T')[0] +
        ' ' +
        this.cashCountDetails?.dateTimeIn.split('T')[1],
      timeIn: this.cashCountDetails?.timeIn,
      timeOut: this.cashCountDetails?.timeOut,
      IMEI: this.cashCountDetails?.IMEI,
      routeCode: this.cashCountDetails?.routeCode,
      PAO: this.cashCountDetails?.PAO,
      firstName: this.cashCountDetails?.firstName,
      lastName: this.cashCountDetails?.lastName,
      odometerStart: this.cashCountDetails?.odomStart,
      odometerEnd: this.cashCountDetails?.odomEnd,
      fuelConsumption: this.cashCountDetails?.fuelConsume,
      amount: this.cashCountDetails?.cashCount,
    });
  }

  closeStatisticsSummaryModal() {
    this.modal.close('cashCountDetails');
  }

  onSubmit() {
    console.log('submit');
  }
}
