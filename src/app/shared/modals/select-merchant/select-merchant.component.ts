import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { getMerchant } from 'src/app/config/getMerchantData';
import { storage } from 'src/app/config/storage';
import { Merchant } from 'src/app/models/merchant.model';
import { HttpService } from 'src/app/services/http.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-select-merchant',
  templateUrl: './select-merchant.component.html',
  styleUrls: ['./select-merchant.component.scss']
})
export class SelectMerchantComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  merchantList: Merchant[] = [];
  @Output() selectedMerchant = new EventEmitter<Merchant>();

  currentMerchant?: Merchant; // Selected merchant
  merchantData: Merchant; // Merchant from localStorage
  disableButton: boolean = false;
  merchantStatusMessage: string = '';
  merchantClass: string = '';

  constructor (private modalService: ModalService, private router: Router, private httpService: HttpService) {
    const merchant = getMerchant();

    this.merchantData = merchant ? merchant : { merchantID: '', merchantName: '' } as Merchant;
  }

  ngOnInit(): void {
    this.getMerchants();
    if (!this.merchantData.merchantID) this.modalService.showModal('selectMerchant');
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  selectMerchant() {
    if (this.disableButton) return;
    this.merchantClass = '';

    const data = this.merchantData ? this.merchantList.find(merchant => merchant.merchantID === this.merchantData.merchantID)! : { merchantID: '', merchantName: '' } as Merchant;

    if (!this.currentMerchant?.merchantID) {
      this.disableButton = true;
      this.merchantStatusMessage = 'Please select a merchant.';
      this.merchantClass = 'error';

      setTimeout(() => {
        this.disableButton = false;
        this.merchantClass = '';
        this.merchantStatusMessage = '';
      }, 3000);
      return;
    }

    if (data && (data as Merchant).merchantID === this.currentMerchant.merchantID) {
      this.disableButton = true;
      this.merchantStatusMessage = 'You are now viewing this merchant';
      this.merchantClass = 'error';

      setTimeout(() => {
        this.disableButton = false;
        this.merchantClass = '';
        this.merchantStatusMessage = '';
      }, 2500);
      return;
    }

    this.disableButton = true;
    this.merchantClass = 'pending';
    this.merchantStatusMessage = 'Getting Merchant Data...';

    setTimeout(() => {
      storage.set('merchant', this.currentMerchant);
      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });
    }, 3000);
  }

  onMerchantChange(merchant: Merchant) {
    console.log(merchant);
  }

  updategetMerchantData() {
    this.disableButton = true;
    // console.debug('Select');

    setTimeout(() => {
      console.debug('update page');
      this.disableButton = false;
    }, 2000);

    const merchant: Merchant = { merchantID: 'id', merchantName: 'name' };
    this.selectedMerchant.emit(merchant);
  }

  getMerchants() {
    this.httpService.get('request/merchants')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.merchantList = (response.data as Merchant[]).sort((a, b) => a.merchantID > b.merchantID ? 1 : -1);
        }, error: (error) => {
          console.error(error);
          this.disableButton = true;
          this.merchantClass = 'error';
          this.merchantStatusMessage = error.error?.message || error.message || 'Error fetching Merchants';
        }, complete: () => {
          this.currentMerchant = this.merchantData.merchantID ? this.merchantList.find(merchant => merchant.merchantID === this.merchantData.merchantID)! : { merchantID: '', merchantName: '' } as Merchant;
        }
      });
  }
}
