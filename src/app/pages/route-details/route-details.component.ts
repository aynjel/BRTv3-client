import { Location } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { generateRandomTime } from 'src/app/config/randomNumber';
import { assetsUrl, currentDate } from 'src/app/constants/constants';
import { BusDetails } from 'src/app/models/bus.model';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-route-details',
  templateUrl: './route-details.component.html',
  styleUrls: ['./route-details.component.scss']
})
export class RouteDetailsComponent {
  readonly busEntryIcon = assetsUrl + 'bus_entry.svg';
  readonly receipts = assetsUrl + 'receipt.svg';
  readonly busIcons = [
    {
      name: '< 15 min',
      path: assetsUrl + 'bus_light_blue.svg'
    },
    {
      name: '> 15 min',
      path: assetsUrl + 'bus_green.svg'
    },
    {
      name: '> 30 min',
      path: assetsUrl + 'bus_yellow.svg'
    },
    {
      name: '> 1 hr',
      path: assetsUrl + 'bus_orange.svg'
    },
    {
      name: 'EOS',
      path: assetsUrl + 'bus_violet.svg'
    },
  ];
  readonly transactionOptions = [
    {
      modalId: 'transactions',
      name: 'Transaction Logs'
    },
    {
      modalId: 'hourlySummary',
      name: 'Hourly Transaction Logs by Station'
    },
    {
      modalId: 'cctvHourly',
      name: 'CCTV Hourly Logs'
    },
    {
      modalId: 'zreading',
      name: 'Z Reading Logs'
    },
    {
      modalId: 'analysis',
      name: 'Performance Analysis'
    },
  ];

  mapStatusMessage: string = 'Fetching Map Data';
  hourlyStatusMessage: string = 'Fetching Hourly Data';
  busStatusMessage: string = 'Fetching Bus Data';

  date: Date;
  maximize: boolean = true;
  routeCode: string = '';
  dropdownIndex: { [key: string]: boolean; } = {};

  buses: BusDetails[] = [
  ];

  selectedBusData?: {
    transactions?: BusDetails,
    zreading?: BusDetails,
    cctvHourly?: BusDetails,
    hourlySummary?: BusDetails;
    analysis?: BusDetails,
  };

  constructor (private activatedRoute: ActivatedRoute, private router: Router, private location: Location, private modalService: ModalService) {
    this.date = currentDate;

    this.activatedRoute.params.subscribe(params => {
      this.routeCode = params['route'];
    });
  }

  openLogs(modalID: string, bus: BusDetails) { // alternatively, programatically create the component here (might change this flow)
    const selectedModalKey = this.transactionOptions.find(transaction => transaction.modalId === modalID)!.modalId;

    this.selectedBusData = {
      [selectedModalKey]: bus
    };

    this.modalService.showModal(modalID);
  }

  /** CLICK */
  toggleAll(select: boolean) {
    if (!select) {
      this.buses.forEach(bus => {
        bus.checked = false;
      });
      return;
    }

    this.buses.forEach(bus => {
      bus.checked = true;
    });
  }

  toggleBus(bus: BusDetails) {
    bus.checked = !bus.checked;
  }

  /** NAVIGATION */
  openPreviousDays(key: string = '') {
    console.log(key);
  }

  goBack() {
    this.location.back();
  }
}
