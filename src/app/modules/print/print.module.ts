import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrintTransactionLogsComponent } from 'src/app/pages/print-transaction-logs/print-transaction-logs.component';
import { SharedModule } from '../shared/shared.module';
import { NgxPrintModule } from 'ngx-print';
import { PrintZreadingLogsComponent } from 'src/app/pages/print-zreading-logs/print-zreading-logs.component';
import { PrintHourlyTransanctionLogsComponent } from 'src/app/pages/print-hourly-transanction-logs/print-hourly-transanction-logs.component';
import { PrintPerformanceAnalysisComponent } from 'src/app/pages/print-performance-analysis/print-performance-analysis.component';
import { PrintCctvHourlyLogsComponent } from 'src/app/pages/print-cctv-hourly-logs/print-cctv-hourly-logs.component';
import { PrintPaoListComponent } from 'src/app/pages/print-pao-list/print-pao-list.component';
import { PrintDriverListComponent } from 'src/app/pages/print-driver-list/print-driver-list.component';
import { PrintRegisteredImeiComponent } from 'src/app/pages/print-registered-imei/print-registered-imei.component';
import { PrintFareVariationsDiscountsComponent } from 'src/app/pages/print-fare-variations-discounts/print-fare-variations-discounts.component';
import { PrintMerchantOperatorsComponent } from 'src/app/pages/print-merchant-operators/print-merchant-operators.component';

const routes: Routes = [
  {
    path: 'transaction-logs',
    component: PrintTransactionLogsComponent,
  },
  {
    path: 'zreading-logs',
    component: PrintZreadingLogsComponent,
  },
  {
    path: 'hourly-transaction-logs',
    component: PrintHourlyTransanctionLogsComponent,
  },
  {
    path: 'performance-analysis',
    component: PrintPerformanceAnalysisComponent,
  },
  {
    path: 'cctv-hourly-logs',
    component: PrintCctvHourlyLogsComponent,
  },
  {
    path: 'setup/pao',
    component: PrintPaoListComponent,
  },
  {
    path: 'setup/driver',
    component: PrintDriverListComponent,
  },
  {
    path: 'setup/imei',
    component: PrintRegisteredImeiComponent,
  },
  {
    path: 'setup/routes',
    component: PrintFareVariationsDiscountsComponent,
  },
  {
    path: 'setup/merchant',
    component: PrintMerchantOperatorsComponent,
  },
];

@NgModule({
  declarations: [
    PrintTransactionLogsComponent,
    PrintZreadingLogsComponent,
    PrintHourlyTransanctionLogsComponent,
    PrintPerformanceAnalysisComponent,
    PrintCctvHourlyLogsComponent,
    PrintPaoListComponent,
    PrintDriverListComponent,
    PrintRegisteredImeiComponent,
    PrintFareVariationsDiscountsComponent,
    PrintMerchantOperatorsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxPrintModule,
    SharedModule,
  ],
  exports: [RouterModule],
})
export class PrintModule {}
