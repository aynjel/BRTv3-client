import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { AlertResponse } from 'src/app/models/alertresponse.model';
import { ModalService } from 'src/app/services/modal.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-alert-details',
  templateUrl: './alert-details.component.html',
  styleUrls: ['./alert-details.component.scss'],
})
export class AlertDetailsComponent implements OnChanges, OnDestroy {
  @Input() selectedAlert?: AlertResponse;

  alertDetails: FormGroup;

  constructor(
    private modalService: ModalService,
    private formBuilder: FormBuilder
  ) {
    this.alertDetails = this.formBuilder.group({
      imei: [''],
      busUnit: [''],
      pao: [''],
      route: [''],
      timeIn: [''],
      timeOut: [''],
      lastPosUpdate: [''],
      latestUpdate: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes['selectedAlert']);
    if (!changes['selectedAlert']) return;
    if (changes['selectedAlert'].firstChange) return;

    const selectedAlert = changes['selectedAlert']
      .currentValue as AlertResponse;
    // console.log('Selected Alert:', selectedAlert);

    const defaultValues = {
      imei: selectedAlert.IMEI || '',
      busUnit: selectedAlert.Outlet || '',
      pao: selectedAlert.PAO || '',
      route: selectedAlert.Route || '',
      timeIn: selectedAlert.TimeIn || '',
      timeOut: selectedAlert.TimeOut || '',
      lastPosUpdate: selectedAlert.LastResponse || '',
      latestUpdate: selectedAlert.LastTransaction || '',
    };

    this.alertDetails.setValue(defaultValues);
  }

  ngOnDestroy(): void {
    this.clearAlertDetails();
  }

  closeAlertDetailsModal() {
    this.modalService.close('alertDetails');
    this.clearAlertDetails();
  }

  clearAlertDetails() {
    this.alertDetails.reset();
  }

  resolveAlert() {
    console.log('Alert Resolved');
  }
}
