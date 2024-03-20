import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { decodeFromBase64 } from 'src/app/config/encryption';
import { currentDate, goodKreditLogo } from 'src/app/constants/constants';
import { Routes } from 'src/app/models/routes.model';
import { TableExportService } from 'src/app/services/table-export.service';
import { ToastService } from 'src/app/services/toast.service';
import environment from 'src/environments/environment';

@Component({
  selector: 'app-print-fare-variations-discounts',
  templateUrl: './print-fare-variations-discounts.component.html',
  styleUrls: ['./print-fare-variations-discounts.component.scss'],
})
export class PrintFareVariationsDiscountsComponent {
  private activatedRoutes = inject(ActivatedRoute);
  private tableExportService = inject(TableExportService);
  private toastService = inject(ToastService);

  companyLogo = goodKreditLogo;
  currentDate = currentDate;

  // busData: BusDetails;

  tableHeaders = [];
  tableData: Routes[];

  constructor() {
    const dataParams = this.activatedRoutes.snapshot.queryParams['data'];
    const data = environment.production
      ? decodeFromBase64(dataParams)
      : JSON.parse(decodeURIComponent(dataParams));
    this.tableHeaders = data.selectedSetupTable.headers;
    this.tableData = data.tableData;

    console.log(this.tableData);
    console.log(data);
  }

  onPrint() {
    window.print();
  }

  exportToExcel() {
    this.tableExportService.exportTableToExcel(
      'fare-variations-discounts-table',
      'Fare Variations Discounts List'
    );
    this.toastService.show({
      message: 'Fare Variations Discounts List exported successfully',
      duration: 3000,
    });
  }
}
