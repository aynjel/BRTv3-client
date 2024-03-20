import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { decodeFromBase64 } from 'src/app/config/encryption';
import { currentDate, goodKreditLogo } from 'src/app/constants/constants';
import { Personnel } from 'src/app/models/personnel.model';
import { TableExportService } from 'src/app/services/table-export.service';
import { ToastService } from 'src/app/services/toast.service';
import environment from 'src/environments/environment';

@Component({
  selector: 'app-print-driver-list',
  templateUrl: './print-driver-list.component.html',
  styleUrls: ['./print-driver-list.component.scss'],
})
export class PrintDriverListComponent {
  private activatedRoutes = inject(ActivatedRoute);
  private tableExportService = inject(TableExportService);
  private toastService = inject(ToastService);

  companyLogo = goodKreditLogo;
  currentDate = currentDate;

  // busData: BusDetails;

  tableHeaders = [];
  tableData: Personnel[];

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
    if (window) {
      window.print();
      this.toastService.show({
        message: 'Printed',
        duration: 3000,
      });
    }
  }

  exportToExcel() {
    this.tableExportService
      .exportTableToExcel('driver-table', 'Driver List')
      .subscribe({
        next: () => {
          this.toastService.show({
            message: 'Exported to Excel',
            duration: 3000,
          });
        },
        error: err => {
          this.toastService.show({
            message: 'Failed to export to Excel',
            duration: 3000,
          });
        },
      });
  }
}
