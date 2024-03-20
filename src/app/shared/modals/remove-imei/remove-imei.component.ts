import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { getMerchant } from 'src/app/config/getMerchantData';
import { IMEI } from 'src/app/models/setup.model';
import { HttpService } from 'src/app/services/http.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-remove-imei',
  templateUrl: './remove-imei.component.html',
  styleUrls: ['./remove-imei.component.scss']
})
export class RemoveIMEIComponent implements OnDestroy {
  private unsubscribe$ = new Subject<void>();

  @Input() imeiData?: IMEI;
  @Output() removed: EventEmitter<void> = new EventEmitter<void>();

  message: string = '';
  messageDisplay: boolean = false;
  isSending: boolean = false;

  constructor (private httpService: HttpService, private modalService: ModalService) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  removeIMEI() {
    if (this.isSending) return;
    if (!this.imeiData?.ID) return;

    this.isSending = true;
    this.messageDisplay = true;
    this.message = `Removing ${this.imeiData.IMEI}...`;

    const params = {
      ...this.imeiData,
      category: 'IMEI'
    };

    this.httpService.delete('setup/remove', params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.message = response.message;

          setTimeout(() => {
            this.isSending = false;
            this.message = '';
            this.removed.emit();
            this.modalService.close('removeIMEI');
          }, 1000);
        }, error: (error) => {
          console.error(error);
          this.isSending = false;
          this.message =  error.error?.message || error.message || `Error removing ${this.imeiData?.IMEI}`;
        }, complete: () => {

        }
      });
  }
}
