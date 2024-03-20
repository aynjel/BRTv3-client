import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { getMerchant } from 'src/app/config/getMerchantData';
import { IMEI } from 'src/app/models/setup.model';
import { HttpService } from 'src/app/services/http.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-add-imei',
  templateUrl: './add-imei.component.html',
  styleUrls: ['./add-imei.component.scss']
})
export class AddIMEIComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  @Input() existingIMEI: IMEI[] = [];
  @Output() added: EventEmitter<void> = new EventEmitter<void>();

  imeiList: IMEI[] = []; // POS from the db
  selectedImeiList: IMEI[] = []; // Selected POS to be added

  message: string = '';
  imeiMessage: string = 'Getting Registered IMEI...';
  messageDisplay: boolean = false;
  isSending: boolean = false;

  constructor (private httpService: HttpService, private modalService: ModalService) { }

  ngOnInit(): void {
    this.getIMEIList();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getIMEIList() {
    this.messageDisplay = true;

    this.httpService.get('setup/devices')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (!response.data.length) {
            this.imeiMessage = 'No IMEI registered';
            return;
          }

          this.imeiList = response.data;

        }, error: (error) => {
          console.error(error);

        }, complete: () => {

        }
      });
  }

  isExistedInSetup(IMEI: string): boolean {
    return this.existingIMEI.some(imei => imei.IMEI === IMEI);
  }

  addToList(imeiData: IMEI) {
    const imeiCheck = this.selectedImeiList.findIndex((selectedImei) => selectedImei.IMEI === imeiData.IMEI);

    if (imeiCheck === -1) this.selectedImeiList.push(imeiData);
    else this.selectedImeiList.splice(imeiCheck, 1);
  }

  addIMEI() {
    if (this.isSending) return;

    this.messageDisplay = true;

    if (!this.selectedImeiList.length) {
      this.message = 'Please select the IMEI you want to add to the setup.';
      return;
    }

    this.isSending = true;
    this.message = 'Adding IMEI...';

    const payload = {
      imeiList: this.selectedImeiList.map(({ IMEI }) => IMEI),
      category: 'IMEI'
    };

    this.httpService.post('setup/add', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.message = response.message;

          setTimeout(() => {
            this.isSending = false;
            this.message = '';

            this.selectedImeiList = [];
            this.added.emit();
            this.modalService.close('addIMEI');
          }, 1000);
        }, error: (error) => {
          console.error(error);
          this.isSending = false;
          this.message = error.error?.message || error.message ||  'Error Adding IMEI';
        }, complete: () => {

        }
      });
  }
}
