import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { decodeFromBase64 } from 'src/app/config/encryption';
import { currentDate, goodKreditLogo } from 'src/app/constants/constants';
import { BusDetails } from 'src/app/models/bus.model';
import { TableExportService } from 'src/app/services/table-export.service';
import environment from 'src/environments/environment';
import { Personnel } from 'src/app/models/personnel.model';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-print-pao-list',
  templateUrl: './print-pao-list.component.html',
  styleUrls: ['./print-pao-list.component.scss'],
})
export class PrintPaoListComponent {
  private activatedRoutes = inject(ActivatedRoute);
  private tableExportService = inject(TableExportService);
  private toastService = inject(ToastService);

  companyLogo = goodKreditLogo;
  currentDate = currentDate;

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
    window.print();
  }

  exportToExcel() {
    this.tableExportService.exportTableToExcel('pao-table', 'PAO List');
    this.toastService.show({
      message: 'PAO List exported successfully',
      duration: 3000,
    });
  }
}
