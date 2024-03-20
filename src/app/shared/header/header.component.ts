import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { log } from 'console';
import { getMerchant } from 'src/app/config/getMerchantData';
import { storage } from 'src/app/config/storage';
import { assetsUrl } from 'src/app/constants/constants';
import { Merchant } from 'src/app/models/merchant.model';
import { ModalService } from 'src/app/services/modal.service';
import environment from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  sideBar: boolean = false;

  readonly icons = {
    brt: {
      url: assetsUrl + 'BRT.png',
      label: 'Bus Revenue Tracker Icon'
    },
    notif: {
      url: assetsUrl + 'notification_bell.svg',
      label: 'Notification Bell'
    },
    user: {
      url: assetsUrl + 'user_icon.svg',
      label: '<USER_NAME>',
    }
  };

  readonly navigation = [
    {
      path: '/dashboard',
      name: 'Dashboard'
    },
    {
      path: '/map',
      name: 'Map'
    },
    {
      path: '/alerts',
      name: 'Alerts'
    },
    {
      path: '/historical',
      name: 'Historical'
    },
    {
      path: '/setup',
      name: 'Setup'
    },
  ];

  merchant: Merchant;
  environment: string = environment.apiUrl;
  user = '<USER_NAME>';
  notifCount = Math.floor(Math.random() * 21);

  constructor (private router: Router, private modalService: ModalService) {
    const merchant = getMerchant();

    this.merchant = merchant ? merchant : { merchantID: '', merchantName: '' } as Merchant;
  }

  ngOnInit(): void {

  }

  openSelectMerchantModal() {
    this.modalService.showModal('selectMerchant');
  }

  activeRoute(path: string): boolean {
    return path === this.router.url;
  }
  closeSidebar() {
    this.sideBar = false;
  }
}
