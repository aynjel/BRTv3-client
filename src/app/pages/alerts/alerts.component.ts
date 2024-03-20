import { Component, NgZone, OnDestroy, OnInit, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { getMerchant } from 'src/app/config/getMerchantData';
import { AlertResponse } from 'src/app/models/alertresponse.model';
import { ModalService } from 'src/app/services/modal.service';
import { SseService } from 'src/app/services/sse.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
})
export class AlertsComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  maximize = false;

  readonly tableNav: string[] = [
    'IMEI',
    'BUS UNIT',
    'PAO',
    'ROUTE',
    'TIME IN',
    'TIME OUT',
    'LAST POS UPDATE',
    'LATEST UPDATE',
  ];
  alertsListSig = signal<AlertResponse[]>([]);

  // Spinner
  isLoading: boolean = true;
  isError: boolean = false;
  errorMessage: string = '';

  constructor(
    private sseService: SseService,
    private modal: ModalService,
    private zone: NgZone
  ) {}
  selectedAlert: any;
  ngOnInit(): void {
    this.getAlerts();
  }

  ngOnDestroy(): void {
    console.log('Alerts Destroyed');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.sseService.disconnect();
  }

  getAlerts() {
    this.isLoading = true;
    this.isError = false;

    this.sseService
      .connect('alerts/list')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          const data = response.data;
          console.log('Alerts:', data);

          this.alertsListSig.set(data);
          this.isLoading = false;
        },
        error: error => {
          console.error(error);
          this.isError = true;
          this.errorMessage =
            error.error?.message || error.message || 'Error fetching alerts';
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  resize() {
    this.maximize = !this.maximize;
  }

  search(event: any) {
    console.log(event.value);
  }

  onSelect(alert: AlertResponse) {
    this.selectedAlert = alert;
    console.log('Selected Alert:', alert);

    this.modal.showModal('alertDetails');
  }
}
