import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { decodeFromBase64 } from 'src/app/config/encryption';
import { currentDate, goodKreditLogo } from 'src/app/constants/constants';
import { TableExportService } from 'src/app/services/table-export.service';
import { ToastService } from 'src/app/services/toast.service';
import environment from 'src/environments/environment';

@Component({
  selector: 'app-print-merchant-operators',
  templateUrl: './print-merchant-operators.component.html',
  styleUrls: ['./print-merchant-operators.component.scss'],
})
export class PrintMerchantOperatorsComponent {
  private activatedRoutes = inject(ActivatedRoute);
  private tableExportService = inject(TableExportService);
  private toastService = inject(ToastService);

  companyLogo = goodKreditLogo;
  currentDate = currentDate;

  tableHeaders = [];
  tableData: [];

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
      'merchant-table',
      'Merchant List'
    );
    this.toastService.show({
      message: 'Exported to Excel',
      duration: 3000,
    });
  }
}
