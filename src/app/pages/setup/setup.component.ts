import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  Subject,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
} from 'rxjs';
import { encodeToBase64 } from 'src/app/config/encryption';
import { getMerchant } from 'src/app/config/getMerchantData';
import { assetsUrl } from 'src/app/constants/constants';
import { Personnel } from 'src/app/models/personnel.model';
import {
  IMEI,
  SetupListType,
  SetupMasterList,
} from 'src/app/models/setup.model';
import { MasterListTableNav } from 'src/app/models/table.model';
import { HttpService } from 'src/app/services/http.service';
import { ModalService } from 'src/app/services/modal.service';
import environment from 'src/environments/environment';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
})
export class SetupComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  readonly printerIcon = assetsUrl + 'printer.svg';
  setupSelection: MasterListTableNav[] = [
    {
      imgUrl: assetsUrl + 'person.svg',
      name: 'Total number of PAO',
      value: 0,
      type: 'PAO',
      headers: ['Date Added', 'Name', 'License', 'Status'],
    },
    {
      imgUrl: assetsUrl + 'steering_wheel.svg',
      name: 'Total number of Drivers',
      value: 0,
      type: 'Driver',
      headers: ['Date Added', 'Name', 'License', 'Status'],
    },
    {
      imgUrl: assetsUrl + 'statistics_pos.svg',
      name: 'Total number of \nRegistered IMEI',
      value: 0,
      type: 'IMEI',
      headers: ['Date Added', 'IMEI', 'Status'],
    },
    {
      imgUrl: assetsUrl + 'statistics_passenger.svg',
      name: 'Fare Variations \nand Discounts',
      value: 0,
      type: 'Routes',
      headers: ['Route Code', 'Minimum Fare'],
    },
    {
      imgUrl: assetsUrl + 'user-tie.svg',
      name: 'Merchant Operators',
      value: 0,
      type: 'Merchants',
      headers: ['Name', 'Status'],
    },
  ];

  searchSetup: string = '';
  personnelType: string = '';
  setupData: any;

  // spinner
  isLoading: boolean = true;
  isError: boolean = false;
  statusMessage: string = 'Fetching Setup Data';
  errorMessage: string = '';

  selectedSetupTable: MasterListTableNav = this.setupSelection[0];
  // selectedSetupTableFormat: MasterListTableFormat = this.setupTableHeaders[0];

  mainSetupList$: BehaviorSubject<SetupMasterList> =
    new BehaviorSubject<SetupMasterList>({
      PAO: [],
      Driver: [],
      IMEI: [],
      Routes: [],
      Merchant: [],
    });

  filteredSetupList: SetupMasterList = {
    PAO: [],
    Driver: [],
    IMEI: [],
    Routes: [],
    Merchant: [],
  };

  constructor(
    private modalService: ModalService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.getSetupData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getSetupData() {
    // this.searchSetup = '';
    this.isError = false;
    this.isLoading = true;

    this.httpService
      .get('setup/fetch')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          const data = response.data;

          Object.keys(data).forEach(item => {
            const findKey = this.setupSelection.find(
              setup => setup.type.toLowerCase() === item.toLowerCase()
            )!;
            findKey.value = data[item].length;
          });

          this.mainSetupList$.next({
            Driver: data.driver,
            IMEI: data.imei,
            PAO: data.PAO,
            Routes: data.routes,
            Merchant: [],
          });

          this.filteredSetupList = {
            Driver: data.driver,
            IMEI: data.imei,
            PAO: data.PAO,
            Routes: data.routes,
            Merchant: [],
          };
        },
        error: error => {
          console.error(error);
          this.isLoading = true;
          this.isError = true;
          this.errorMessage =
            error.error?.message ||
            error.message ||
            'Unable to fetch setup data';
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  add(setupType: string) {
    if (this.isLoading) return;
    if (!setupType) return;

    const modal = this.modalSelect(setupType);

    let modalID = '';
    switch (this.selectedSetupTable.type) {
      case 'PAO':
      case 'Driver':
        this.personnelType = modal.type === 'Driver' ? 'Driver' : 'PAO';
        modalID = 'addPersonnel';
        break;
      case 'IMEI':
        modalID = 'addIMEI';
        break;
      case 'Routes':
        modalID = 'addRoute';
        break;
      case 'Merchant':
        modalID = 'addMerchant';
        break;
      default:
        return;
    }

    this.modalService.showModal(modalID);
  }

  edit(setupType: string, setupData: any) {
    if (!setupType) return;
    const modal = this.modalSelect(setupType);

    let modalID = '';
    this.setupData = setupData;
    switch (this.selectedSetupTable.type) {
      case 'PAO':
      case 'Driver':
        this.personnelType = modal.type === 'Driver' ? 'Driver' : 'PAO';
        modalID = 'editPersonnel';
        break;
      case 'IMEI':
        modalID = 'editIMEI';
        break;
      case 'Routes':
        modalID = 'editRoute';
        break;
      case 'Merchant':
        modalID = 'editMerchant';
        break;
      default:
        return;
    }

    this.modalService.showModal(modalID);
  }

  remove(setupType: string, setupData: any) {
    if (!setupType) return;
    const modal = this.modalSelect(setupType);

    let modalID = '';
    this.setupData = setupData;
    switch (this.selectedSetupTable.type) {
      case 'PAO':
      case 'Driver':
        this.personnelType = modal.type === 'Driver' ? 'Driver' : 'PAO';
        modalID = 'removePersonnel';
        break;
      case 'IMEI':
        modalID = 'removeIMEI';
        break;
      case 'Routes':
        modalID = 'removeRoute';
        break;
      case 'Merchant':
        modalID = 'removeMerchant';
        break;
      default:
        return;
    }

    this.modalService.showModal(modalID);
  }

  filterData() {
    const pattern = new RegExp(this.searchSetup.trim(), 'i');

    this.mainSetupList$
      .pipe(distinctUntilChanged(), debounceTime(200))
      .subscribe(list => {
        this.filteredSetupList = {
          PAO: list.PAO.filter(
            personnel =>
              pattern.test(personnel.firstName) ||
              pattern.test(personnel.lastName) ||
              pattern.test(personnel.email) ||
              pattern.test(personnel.license)
          ),
          Driver: list.Driver.filter(
            personnel =>
              pattern.test(personnel.firstName) ||
              pattern.test(personnel.lastName) ||
              pattern.test(personnel.email) ||
              pattern.test(personnel.license)
          ),
          IMEI: list.IMEI.filter(imei => pattern.test(imei.IMEI)),
          Routes: [],
          Merchant: [],
        };
        // this.filteredSetupList.PAO = list.PAO.filter(personnel => pattern.test(personnel.firstName) || pattern.test(personnel.lastName) || pattern.test(personnel.email) || pattern.test(personnel.license));

        // this.filteredSetupList.Driver = list.Driver.filter(personnel => pattern.test(personnel.firstName) || pattern.test(personnel.lastName) || pattern.test(personnel.email) || pattern.test(personnel.license));

        // this.filteredSetupList.IMEI = list.IMEI.filter(imei => pattern.test(imei.IMEI));
      });
  }

  selectSetup(type: string) {
    // this.searchSetup = '';
    this.selectedSetupTable = this.setupSelection.find(
      item => item.type === type
    )!;
  }

  identifyStatus(status?: string | boolean) {
    if (status?.toString().toLowerCase() === 'ACTIVE'.toLowerCase())
      return 'active';
    return 'inactive';
  }

  private modalSelect(type: string) {
    return this.setupSelection.find(setup => setup.type === type)!;
  }

  onPrint() {
    const data = {
      selectedSetupTable: this.selectedSetupTable,
      tableData:
        this.filteredSetupList[this.selectedSetupTable.type as SetupListType],
    };

    const transformedData = environment.production
      ? encodeToBase64(JSON.stringify(data))
      : JSON.stringify(data);
    const windowAdditionals =
      'location=yes,height=800,width=1100,scrollbars=yes,status=yes';

    switch (this.selectedSetupTable.type) {
      case 'PAO':
        window.open(
          '#/print/setup/pao?data=' + transformedData,
          '_blank',
          windowAdditionals
        );
        break;
      case 'Driver':
        window.open(
          '#/print/setup/driver?data=' + transformedData,
          '_blank',
          windowAdditionals
        );
        break;
      case 'IMEI':
        window.open(
          '#/print/setup/imei?data=' + transformedData,
          '_blank',
          windowAdditionals
        );
        break;
      case 'Routes':
        window.open(
          '#/print/setup/routes?data=' + transformedData,
          '_blank',
          windowAdditionals
        );
        break;
      case 'Merchant':
        window.open(
          '#/print/setup/merchant?data=' + transformedData,
          '_blank',
          windowAdditionals
        );
        break;
      default:
        return;
    }
  }
}
