import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { getMerchant } from 'src/app/config/getMerchantData';
import { IMEI } from 'src/app/models/setup.model';
import { HttpService } from 'src/app/services/http.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-edit-imei',
  templateUrl: './edit-imei.component.html',
  styleUrls: ['./edit-imei.component.scss']
})
export class EditIMEIComponent implements OnChanges, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  @Input() imeiData?: IMEI;
  @Output() updated: EventEmitter<void> = new EventEmitter<void>();
  editIMEIForm: FormGroup;

  message: string = '';
  messageDisplay: boolean = false;
  isSending: boolean = false;

  constructor (private formbuilder: FormBuilder, private httpService: HttpService, private modalService: ModalService) {
    this.editIMEIForm = this.formbuilder.group({
      status: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['imeiData']) return;
    if (changes['imeiData'].firstChange) return;

    const imeiData = changes['imeiData'].currentValue as IMEI;

    const defaultValues = {
      status: imeiData.status || ''
    };

    this.editIMEIForm.setValue(defaultValues);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateIMEI() {
    this.messageDisplay = true;

    this.isSending = true;
    this.message = `Updating IMEI...`;

    const payload = {
      ...this.editIMEIForm.value,
      ID: this.imeiData?.ID,
      IMEI: this.imeiData?.IMEI,
      category: 'IMEI'
    };

    this.httpService.update('setup/update', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.message = response.message;

          setTimeout(() => {
            this.isSending = false;
            this.message = '';
            this.updated.emit();
            this.modalService.close('editIMEI');
          }, 1000);
        }, error: (error) => {
          console.error(error);
          this.isSending = false;
          this.message = error.error?.message || error.message ||  `Error updating IMEI`;
        }, complete: () => {

        }
      });
  }
}
