import { Location } from '@angular/common';
import {
  ApplicationRef,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  WritableSignal,
  createComponent,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { identifyBusColor } from 'src/app/config/busColor';
import { convertToDateStr } from 'src/app/config/dateStr';
import { storage } from 'src/app/config/storage';
import { assetsUrl, currentDate, dateRegex } from 'src/app/constants/constants';
import { BusDetails, BusRoutes } from 'src/app/models/bus.model';
import { CashCountDetails } from 'src/app/models/cashCount.model';
import { HttpService } from 'src/app/services/http.service';
import { ModalService } from 'src/app/services/modal.service';
import { BusDetailsComponent } from 'src/app/shared/tooltip/bus-details/bus-details.component';

const busSize = () => storage.get('busSize');

@Component({
  selector: 'app-buses',
  templateUrl: './buses.component.html',
  styleUrls: ['./buses.component.scss'],
})
export class BusesComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  // readonly busEntryIcon = assetsUrl + 'bus_entry.svg';
  readonly receipts = assetsUrl + 'receipt.svg';
  readonly showBusIcon = assetsUrl + 'bus.svg';
  readonly transactionOptions = [
    {
      modalId: 'transactions',
      name: 'Transaction Logs',
    },
    {
      modalId: 'hourlySummary',
      name: 'Hourly Transaction Logs by Station',
    },
    {
      modalId: 'cctvHourly',
      name: 'CCTV Hourly Logs',
    },
    {
      modalId: 'zreading',
      name: 'Z-Reading Logs',
    },
    {
      modalId: 'analysis',
      name: 'Performance Analysis',
    },
  ];

  busCategory = [
    {
      name: '< 15 min',
      path: assetsUrl + 'bus_light_blue.svg',
      key: 'blue',
      count: 0,
    },
    {
      name: '> 15 min',
      path: assetsUrl + 'bus_green.svg',
      key: 'green',
      count: 0,
    },
    {
      name: '> 30 min',
      path: assetsUrl + 'bus_yellow.svg',
      key: 'yellow',
      count: 0,
    },
    {
      name: '> 1 hr',
      path: assetsUrl + 'bus_orange.svg',
      key: 'orange',
      count: 0,
    },
    {
      name: 'EOS',
      path: assetsUrl + 'bus_violet.svg',
      key: 'violet',
      count: 0,
    },
    {
      name: 'No Route',
      path: assetsUrl + 'bus_red.svg',
      key: 'red',
      count: 0,
    },
  ];

  date: Date;
  busType: string = 'all';
  busCount: number = 0;

  isLoading: boolean = true;
  isError: boolean = false;
  statusMessage: string = 'Fetching Buses';
  errorMessage: string = '';

  filtered: boolean = false;
  private selectedBus: string = '';

  busRoutes: BusRoutes[] = [];
  openedBusDetails?: BusDetails;

  selectedBusData?: {
    transactions?: BusDetails;
    zreading?: BusDetails;
    cctvHourly?: BusDetails;
    hourlySummary?: BusDetails;
    analysis?: BusDetails;
  };
  cashCountDetails?: CashCountDetails;

  updateSummary: WritableSignal<boolean> = signal(true);

  constructor (
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private modalService: ModalService,
    private cdr: ChangeDetectorRef,
    private httpService: HttpService
  ) {
    this.date = new Date(
      this.activatedRoute.snapshot.params['date'] ??
      convertToDateStr(currentDate)
    );

    const size = busSize();
    this.maximize = size ? storage.decode(size) : false;

    console.log(this.activatedRoute.snapshot.params['date']);

    this.activatedRoute.queryParams.subscribe(params => {
      // if no type, redirect to dashboard
      if (!params['type']) return;

      // if type is not active or inactive, redirect to dashboard
      if (!['active', 'inactive'].includes(params['type'])) {
        this.router.navigate(['/dashboard']);
        return;
      }

      // if date is not valid, redirect to dashboard
      if (!dateRegex.test(this.date.toISOString().split('T')[0])) {
        this.router.navigate(['/dashboard']);
      }

      this.busType = params['type'];
    });
  }

  ngOnInit(): void {
    this.getBuses();

    this.busRoutes.forEach(routes => {
      this.busCount += routes.buses.length;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getBuses() {
    this.isError = false;
    this.isLoading = true;
    this.filtered = false;
    this.selectedBus = '';
    this.busCategory.forEach(category => category.count = 0);

    const params = {
      date: convertToDateStr(this.date),
      type: this.busType,
    };

    this.httpService
      .get('buses/list', params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          const buses = response.data as BusDetails[];

          if (!buses.length) {
            this.isError = true;
            this.errorMessage = 'No Buses';
            return;
          }

          this.busCount = buses.length;
          this.busRoutes = buses.reduce((acc: BusRoutes[], curr) => {
            const routeGroup = acc.find(
              route => route.routeCode === curr.routeCode
            );

            if (!routeGroup) {
              acc.push({
                checked: true,
                indeterminate: false,
                routeCode: curr.routeCode,
                routeName: curr.routeName,
                totalBusCount: 1,
                buses: [curr],
              });
            } else {
              routeGroup.totalBusCount!++;
              routeGroup.buses.push(curr);
            }
            return acc;
          }, []);

          this.initializeBusRoutesPagination();
        },
        error: error => {
          console.error(error);
          this.isError = true;
          this.errorMessage =
            error.error?.message || error.message || 'Error fetching buses';
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  /** NAVIGATION */
  returnToDashboard() {
    this.location.back();
  }

  openPreviousDays(key: string = '') {
    console.log(key);
  }


  /** PAGING */
  currentPage: number = 0;
  itemsPerPage: number = 8;
  routePagination: {
    [key: number]: { currentPage: number; totalPages: number; };
  } = {};
  dropdownIndex: { [key: string]: boolean; } = {};

  private initializeBusRoutesPagination() {
    this.busRoutes.forEach((_, index) => {
      const totalPages = Math.ceil(
        this.busRoutes[index].buses.length / this.itemsPerPage
      );

      this.routePagination[index] = { currentPage: 0, totalPages: totalPages };
    });
  }

  routesPageRedirect(routeCode: string) {
    this.router.navigate(['dashboard/routes', routeCode]);
  }

  paginatedBuses(routeIndex: number): BusDetails[] {
    const startIndex =
      this.routePagination[routeIndex].currentPage * this.itemsPerPage;
    return this.busRoutes[routeIndex].buses.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  getPages(totalPages: number): number[] {
    return new Array(totalPages).fill(0).map((_, index) => index + 1);
  }

  changePage(routeIndex: number, pageIndex: number) {
    this.dropdownIndex = {};
    this.routePagination[routeIndex].currentPage = pageIndex;
  }

  activePage(routeIndex: number, pageIndex: number) {
    return this.routePagination[routeIndex].currentPage === pageIndex;
  }


  /** MODAL */
  openLogs(modalID: string, bus: BusDetails) {
    // alternatively, programatically create the component here (might change this flow)
    const selectedModalKey = this.transactionOptions.find(
      transaction => transaction.modalId === modalID
    )!.modalId;

    this.selectedBusData = {
      [selectedModalKey]: bus,
    };

    this.modalService.showModal(modalID);
  }


  /** SIZING/COLORING */
  maximize: boolean; // bus item size

  resizeBuses() {
    this.itemsPerPage = this.maximize ? 8 : 6;
    this.maximize = !this.maximize;
    storage.set('busSize', this.maximize);

    this.initializeBusRoutesPagination();
  }

  getBusColor(color: string) {
    if (this.filtered) return;
    const category = this.busCategory.find(item => item.key === color)!;

    category.count++;
    this.cdr.detectChanges();
  }

  filterBusColor(color: string) {
    if (this.selectedBus === color) {
      this.selectedBus = '';
      this.filtered = false;
      return;
    }

    const category = this.busCategory.find(item => item.key === color)!;
    if (!category.count) return;

    this.selectedBus = color;
    this.filtered = true;
    category.count = 0;

    this.busRoutes = this.busRoutes.map(route => {
      const buses = route.buses.filter(bus => identifyBusColor(bus) === color);
      category.count += buses.length;

      return {
        checked: route.checked,
        indeterminate: route.indeterminate,
        routeCode: route.routeCode,
        routeName: route.routeName,
        totalBusCount: buses.length,
        buses: buses
      };
    }).filter(routes => routes.buses.length);
  }

  selectBusCategory(key: string) {
    if (!this.selectedBus) return true;
    return this.selectedBus === key;
  }


  /** TOGGLE CHECKBOXES */
  toggleAll(select: boolean) {
    if (!select) {
      this.busRoutes.forEach(busRoute => {
        busRoute.checked = false;

        busRoute.buses.forEach(bus => {
          bus.checked = false;
        });
      });
    } else {
      this.busRoutes.forEach(busRoute => {
        busRoute.checked = true;

        busRoute.buses.forEach(bus => {
          bus.checked = true;
        });
      });
    }

    this.updateSummary.update(value => !value);
  }

  toggleRoute(route: BusRoutes) {
    route.checked = !route.checked;

    route.buses.forEach(bus => {
      bus.checked = route.checked;
    });

    this.updateIndeterminateState(route);
    this.updateSummary.update(value => !value);
  }

  toggleBus(bus: BusDetails) {
    bus.checked = !bus.checked;

    const findRoute = this.busRoutes.find(
      busRoute => busRoute.routeCode === bus.routeCode
    )!;

    this.updateIndeterminateState(findRoute);
    this.updateSummary.update(value => !value);
  }

  private updateIndeterminateState(route: BusRoutes) {
    const allChecked = route.buses.every(bus => bus.checked);
    const someChecked = route.buses.some(bus => bus.checked);

    route.checked = allChecked;
    route.indeterminate = !allChecked && someChecked;
  }

  openCashCountDetails(bus: BusDetails) {
    this.cashCountDetails = {
      cashCount: bus.cashCount + '' || '0',
      dateTimeIn: bus.firstTransact + '',
      fuelConsume: bus.fuelConsume + '',
      IMEI: bus.IMEI + '',
      PAO: bus.PAO,
      odomEnd: bus.odomEnd + '',
      odomStart: bus.odomStart + '',
      routeCode: bus.routeCode,
      timeIn: bus.timeIn,
      timeOut: bus.timeOut,
      firstName: bus.PAO?.split(', ')[1] ?? '',
      lastName: bus.PAO?.split(', ')[0] ?? '',
    };

    this.modalService.showModal('cashCountDetails');
  }

  /** BUS DETAILS DROPDOWN */
  @ViewChild('busDetails', { read: ViewContainerRef })
  busDetails!: ViewContainerRef;
  @ViewChild('template', { read: TemplateRef }) template!: TemplateRef<any>;

  openBusDetails(bus: BusDetails) {
    if (this.openedBusDetails?.ID === bus.ID) return;
    this.busDetails.clear();
    this.busDetails.createComponent(BusDetailsComponent).instance.busData = bus;

    if (this.openedBusDetails && this.openedBusDetails.ID !== bus.ID) {
      const openedDropdown = document.getElementById(
        `detail-${this.openedBusDetails?.ID}`
      );
      openedDropdown?.removeAttribute('open');

      this.openedBusDetails = bus;
      return;
    }

    // dropdown
    this.openedBusDetails = bus;
  }
}
